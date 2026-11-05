'use client';

import { useState, useTransition } from 'react';
import { Save } from 'lucide-react';
import { saveAbout } from '@/actions/admin';
import { FileUpload } from './FileUpload';
import { ActionStatus } from './ui';

const FILES = [
  { name: 'profileImage', label: 'Profile photo', hint: 'Used in the hero, About card and as the site icon.', aspect: 'aspect-square max-w-56' },
  { name: 'coverImage', label: 'Cover banner', hint: 'Shown at the top of the About card. 4:1 works best (e.g. 1200×300).', aspect: 'aspect-[4/1]' },
  { name: 'resumeFile', label: 'CV / Resume (PDF)', hint: 'Visitors can download this from the site.', kind: 'file' },
];

export function ProfileForm({ about }) {
  const initial = Object.fromEntries(FILES.map((f) => [f.name, about[f.name] ?? '']));
  const [values, setValues] = useState(initial);
  const [result, setResult] = useState(null);
  const [pending, startTransition] = useTransition();

  // Only send fields that changed, so large legacy Base64 images aren't re-uploaded.
  const changed = Object.fromEntries(Object.entries(values).filter(([k, v]) => v !== initial[k]));
  const dirty = Object.keys(changed).length > 0;

  const submit = (e) => {
    e.preventDefault();
    startTransition(async () => setResult(await saveAbout(changed)));
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      {FILES.map((f) => (
        <section key={f.name} className="card grid gap-5 p-6 md:grid-cols-[220px_1fr]">
          <div>
            <h2 className="font-semibold">{f.label}</h2>
            <p className="mt-1 text-sm text-muted">{f.hint}</p>
          </div>
          <FileUpload
            value={values[f.name]}
            onChange={(url) => setValues((v) => ({ ...v, [f.name]: url }))}
            kind={f.kind || 'image'}
            aspect={f.aspect}
            label={f.kind === 'file' ? 'Upload PDF' : 'Upload image'}
          />
        </section>
      ))}

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-end gap-3 rounded-2xl border border-border bg-bg/80 p-3 backdrop-blur">
        <ActionStatus result={result} successText="Images & CV updated" />
        <button type="submit" disabled={pending || !dirty} className="btn-primary">
          <Save size={16} /> {pending ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}
