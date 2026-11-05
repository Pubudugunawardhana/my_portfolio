'use client';

import { useState, useTransition } from 'react';
import { Save } from 'lucide-react';
import { saveAbout } from '@/actions/admin';
import { ActionStatus, Field } from './ui';

const SECTIONS = [
  {
    title: 'Basics',
    fields: [
      { name: 'name', label: 'Full name', required: true },
      { name: 'role', label: 'Role / headline', placeholder: 'IIT Undergraduate | Uva Wellassa University' },
      { name: 'location', label: 'Location', placeholder: 'Colombo, Sri Lanka' },
      { name: 'email', label: 'Contact email', type: 'email' },
    ],
  },
  {
    title: 'Bio',
    fields: [
      { name: 'shortBio', label: 'Short bio', hint: 'Shown in the hero section.', textarea: 3, wide: true },
      { name: 'longBio', label: 'Long bio', hint: 'Shown in the About section. Blank lines start new paragraphs.', textarea: 8, wide: true },
    ],
  },
  {
    title: 'Education',
    fields: [
      { name: 'university', label: 'University' },
      { name: 'school', label: 'High school' },
    ],
  },
  {
    title: 'Social links',
    fields: [
      { name: 'github', label: 'GitHub URL', type: 'url', placeholder: 'https://github.com/…' },
      { name: 'linkedin', label: 'LinkedIn URL', type: 'url', placeholder: 'https://linkedin.com/in/…' },
      { name: 'medium', label: 'Medium URL', type: 'url', placeholder: 'https://medium.com/@…' },
    ],
  },
];

const FIELD_NAMES = SECTIONS.flatMap((s) => s.fields.map((f) => f.name));

export function AboutForm({ about }) {
  const [values, setValues] = useState(() => Object.fromEntries(FIELD_NAMES.map((n) => [n, about[n] ?? ''])));
  const [result, setResult] = useState(null);
  const [pending, startTransition] = useTransition();

  const set = (name) => (e) => setValues((v) => ({ ...v, [name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    startTransition(async () => setResult(await saveAbout(values)));
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      {SECTIONS.map((section) => (
        <fieldset key={section.title} className="card p-6">
          <legend className="sr-only">{section.title}</legend>
          <h2 className="mb-5 font-semibold">{section.title}</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {section.fields.map((f) => (
              <Field key={f.name} label={f.label} hint={f.hint} className={f.wide ? 'sm:col-span-2' : ''}>
                {f.textarea ? (
                  <textarea rows={f.textarea} value={values[f.name]} onChange={set(f.name)} className="input resize-y" />
                ) : (
                  <input
                    type={f.type || 'text'}
                    required={f.required}
                    placeholder={f.placeholder}
                    value={values[f.name]}
                    onChange={set(f.name)}
                    className="input"
                  />
                )}
              </Field>
            ))}
          </div>
        </fieldset>
      ))}

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-end gap-3 rounded-2xl border border-border bg-bg/80 p-3 backdrop-blur">
        <ActionStatus result={result} successText="About section updated" />
        <button type="submit" disabled={pending} className="btn-primary">
          <Save size={16} /> {pending ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}
