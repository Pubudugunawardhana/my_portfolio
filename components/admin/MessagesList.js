'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, MailOpen, RefreshCw, Reply, Trash2 } from 'lucide-react';
import { deleteMessage, setMessageRead } from '@/actions/admin';
import { ActionStatus } from './ui';

const formatDate = (iso) =>
  new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });

export function MessagesList({ messages }) {
  const router = useRouter();
  const [openId, setOpenId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [result, setResult] = useState(null);
  const [pending, startTransition] = useTransition();

  const unreadCount = messages.filter((m) => !m.read).length;
  const shown = filter === 'unread' ? messages.filter((m) => !m.read) : messages;

  const run = (action) => startTransition(async () => setResult(await action()));

  const open = (m) => {
    setOpenId(openId === m._id ? null : m._id);
    if (!m.read) run(() => setMessageRead(m._id, true));
  };

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-full border border-border bg-card p-1">
          {[['all', `All (${messages.length})`], ['unread', `Unread (${unreadCount})`]].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-full px-4 py-1.5 text-sm transition ${filter === key ? 'bg-accent text-accent-fg' : 'text-muted hover:text-fg'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <ActionStatus result={result?.ok ? null : result} />
          <button onClick={() => startTransition(() => router.refresh())} className="btn-ghost">
            <RefreshCw size={15} className={pending ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="card p-10 text-center text-sm text-muted">{filter === 'unread' ? 'No unread messages 🎉' : 'No messages yet.'}</div>
      ) : (
        <ul className="space-y-3">
          {shown.map((m) => {
            const isOpen = openId === m._id;
            return (
              <li key={m._id} className={`card overflow-hidden transition ${!m.read ? 'border-accent/40' : ''}`}>
                <button onClick={() => open(m)} aria-expanded={isOpen} className="flex w-full items-start gap-4 p-4 text-left hover:bg-card-hover">
                  <span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full ${m.read ? 'bg-card-hover text-muted' : 'bg-accent-soft text-accent'}`}>
                    {m.read ? <MailOpen size={16} /> : <Mail size={16} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <span className={`truncate ${m.read ? '' : 'font-semibold'}`}>{m.name}</span>
                      <span className="text-xs text-muted">{formatDate(m.createdAt)}</span>
                    </span>
                    <span className="block truncate text-sm text-muted">{m.subject}</span>
                    {!isOpen && <span className="mt-1 block truncate text-sm text-muted/80">{m.message}</span>}
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-border px-4 pb-4 pt-4 sm:pl-[4.25rem]">
                    <p className="text-sm text-muted">{m.email}</p>
                    <p className="mt-3 whitespace-pre-wrap leading-relaxed">{m.message}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`} className="btn-primary px-4 py-2">
                        <Reply size={15} /> Reply
                      </a>
                      <button onClick={() => run(() => setMessageRead(m._id, !m.read))} className="btn-ghost px-4 py-2">
                        {m.read ? <><Mail size={15} /> Mark unread</> : <><MailOpen size={15} /> Mark read</>}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this message?')) run(() => deleteMessage(m._id));
                        }}
                        className="btn-ghost px-4 py-2 text-red-500"
                      >
                        <Trash2 size={15} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
