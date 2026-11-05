'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { AnimatePresence, motion, Reorder, useDragControls } from 'motion/react';
import { GripVertical, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { deleteItem, reorderItems, saveItem } from '@/actions/admin';
import { FileUpload } from './FileUpload';
import { ActionStatus, Field } from './ui';

const toFormValue = (field, value) => {
  if (field.type === 'tags') return (value ?? []).join(', ');
  if (field.type === 'gallery') return value ?? [];
  return value ?? '';
};

// Editor drawer for creating or editing one item.
function Editor({ kind, fields, item, onClose }) {
  const isNew = !item?._id;
  const initial = Object.fromEntries(fields.map((f) => [f.name, toFormValue(f, item?.[f.name])]));
  const [values, setValues] = useState(initial);
  const [result, setResult] = useState(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const set = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  const submit = (e) => {
    e.preventDefault();
    // When editing, skip unchanged image fields so large legacy Base64 images aren't re-sent.
    const payload = Object.fromEntries(
      Object.entries(values).filter(([k, v]) => {
        const type = fields.find((f) => f.name === k).type;
        if (isNew || (type !== 'image' && type !== 'gallery')) return true;
        return JSON.stringify(v) !== JSON.stringify(initial[k]);
      })
    );
    startTransition(async () => {
      const res = await saveItem(kind, item?._id ?? null, payload);
      setResult(res);
      if (res.ok) onClose();
    });
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.form
        onSubmit={submit}
        className="relative flex h-full w-full max-w-xl flex-col border-l border-border bg-bg shadow-2xl"
        initial={{ x: 60 }}
        animate={{ x: 0 }}
        exit={{ x: 60 }}
        transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-semibold">{isNew ? 'Add new' : 'Edit'}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full hover:bg-card-hover"><X size={18} /></button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
          {fields.map((f) =>
            f.type === 'gallery' ? (
              <Field key={f.name} label={`${f.label} (optional)`} hint={f.hint}>
                <div className="grid grid-cols-2 gap-3">
                  {/* Filled slots plus one empty slot for the next upload */}
                  {[...values[f.name], ...(values[f.name].length < f.max ? [''] : [])].map((url, i) => (
                    <FileUpload
                      key={url || `empty-${i}`}
                      value={url}
                      aspect={f.aspect}
                      label="Add screenshot"
                      onChange={(next) =>
                        set(
                          f.name,
                          next
                            ? [...values[f.name].slice(0, i), next, ...values[f.name].slice(i + 1)]
                            : values[f.name].filter((_, j) => j !== i)
                        )
                      }
                    />
                  ))}
                </div>
              </Field>
            ) : f.type === 'image' ? (
              <Field key={f.name} label={f.label} hint={f.hint}>
                <FileUpload value={values[f.name]} onChange={(url) => set(f.name, url)} aspect={f.aspect} />
              </Field>
            ) : (
              <Field key={f.name} label={`${f.label}${f.required ? '' : ' (optional)'}`} hint={f.hint}>
                {f.type === 'textarea' ? (
                  <textarea rows={7} required={f.required} value={values[f.name]} onChange={(e) => set(f.name, e.target.value)} className="input resize-y" />
                ) : (
                  <input
                    type={f.type === 'url' ? 'url' : 'text'}
                    required={f.required}
                    placeholder={f.placeholder}
                    value={values[f.name]}
                    onChange={(e) => set(f.name, e.target.value)}
                    className="input"
                  />
                )}
              </Field>
            )
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border px-6 py-4">
          <ActionStatus result={result?.ok ? null : result} />
          <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          <button type="submit" disabled={pending} className="btn-primary"><Save size={16} /> {pending ? 'Saving…' : 'Save'}</button>
        </div>
      </motion.form>
    </motion.div>
  );
}

// One draggable row. Only the grip starts a drag, so buttons inside stay clickable.
function Row({ item, children, onDragStart, onDragEnd, onMove }) {
  const controls = useDragControls();
  return (
    <Reorder.Item
      as="li"
      value={item}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onDragEnd}
      whileDrag={{ scale: 1.02, boxShadow: '0 20px 40px -12px rgb(0 0 0 / 0.25)', zIndex: 10 }}
      className="card relative flex items-center gap-3 p-4"
    >
      <button
        type="button"
        aria-label="Drag to reorder (or use arrow keys)"
        onPointerDown={(e) => {
          onDragStart();
          controls.start(e);
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            onMove(e.key === 'ArrowUp' ? -1 : 1);
          }
        }}
        className="grid h-9 w-7 shrink-0 cursor-grab touch-none place-items-center rounded-lg text-muted hover:bg-card-hover hover:text-fg active:cursor-grabbing"
      >
        <GripVertical size={18} />
      </button>
      {children}
    </Reorder.Item>
  );
}

export function CrudManager({ kind, items, fields, renderItem, addLabel = 'Add new', emptyText = 'Nothing here yet.' }) {
  const [editing, setEditing] = useState(null); // null | {} (new) | item
  const [confirmId, setConfirmId] = useState(null);
  const [result, setResult] = useState(null);
  const [pending, startTransition] = useTransition();

  // Local copy for drag-and-drop; reset whenever the server sends fresh items.
  const [list, setList] = useState(items);
  const [source, setSource] = useState(items);
  if (items !== source) {
    setSource(items);
    setList(items);
  }

  // Latest order during a drag. onDragEnd can fire with a handler from before the
  // last reorder, so reading state there would save the old order.
  const latest = useRef(items);
  const reorder = (next) => {
    latest.current = next;
    setList(next);
  };

  const saveOrder = (next) => {
    if (!next) return;
    const ids = next.map((i) => i._id);
    if (ids.join() === items.map((i) => i._id).join()) return;
    startTransition(async () => setResult(await reorderItems(kind, ids)));
  };

  const move = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= list.length) return;
    const next = [...list];
    [next[index], next[target]] = [next[target], next[index]];
    reorder(next);
    saveOrder(next);
  };

  const remove = (id) =>
    startTransition(async () => {
      setResult(await deleteItem(kind, id));
      setConfirmId(null);
    });

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {list.length} item{list.length === 1 ? '' : 's'}
          {list.length > 1 && <span className="hidden sm:inline"> · drag <GripVertical size={13} className="inline" /> to reorder (top = shown first)</span>}
        </p>
        <div className="flex items-center gap-3">
          <ActionStatus result={result} successText="Saved" />
          <button onClick={() => setEditing({})} className="btn-primary"><Plus size={16} /> {addLabel}</button>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="card p-10 text-center text-sm text-muted">{emptyText}</div>
      ) : (
        <Reorder.Group as="ul" axis="y" values={list} onReorder={reorder} className="space-y-3">
          {list.map((item, index) => (
            <Row key={item._id} item={item} onDragStart={() => (latest.current = list)} onDragEnd={() => saveOrder(latest.current)} onMove={(dir) => move(index, dir)}>
              <div className="min-w-0 flex-1">{renderItem(item)}</div>
              {confirmId === item._id ? (
                <div className="flex shrink-0 items-center gap-2">
                  <span className="hidden text-sm text-muted sm:inline">Delete?</span>
                  <button disabled={pending} onClick={() => remove(item._id)} className="btn bg-red-500 px-3 py-1.5 text-white hover:bg-red-600">Yes</button>
                  <button onClick={() => setConfirmId(null)} className="btn-ghost px-3 py-1.5">No</button>
                </div>
              ) : (
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => setEditing(item)} aria-label="Edit" className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-card-hover hover:text-fg"><Pencil size={16} /></button>
                  <button onClick={() => setConfirmId(item._id)} aria-label="Delete" className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-red-500/10 hover:text-red-500"><Trash2 size={16} /></button>
                </div>
              )}
            </Row>
          ))}
        </Reorder.Group>
      )}

      <AnimatePresence>
        {editing && <Editor kind={kind} fields={fields} item={editing} onClose={() => setEditing(null)} />}
      </AnimatePresence>
    </>
  );
}
