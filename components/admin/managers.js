'use client';

import { Award, FolderGit2 } from 'lucide-react';
import { CrudManager } from './CrudManager';

function Thumb({ src, Icon }) {
  return (
    <span className="grid h-14 w-20 shrink-0 place-items-center overflow-hidden rounded-lg border border-border bg-card-hover">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src ? <img src={src} alt="" className="h-full w-full object-cover" /> : <Icon size={18} className="text-muted" />}
    </span>
  );
}

const Chips = ({ list }) => (
  <span className="mt-1.5 flex flex-wrap gap-1">
    {list.map((t) => (
      <span key={t} className="rounded-md border border-border px-1.5 py-0.5 font-mono text-[11px] text-muted">{t}</span>
    ))}
  </span>
);

export function ProjectsManager({ items }) {
  return (
    <CrudManager
      kind="project"
      items={items}
      addLabel="Add project"
      emptyText="No projects yet — add your first one."
      fields={[
        { name: 'title', label: 'Title', required: true },
        { name: 'image', label: 'Cover screenshot', type: 'image', hint: 'Shown first. 16:10 screenshots look best.', aspect: 'aspect-[16/10]' },
        { name: 'gallery', label: 'More screenshots', type: 'gallery', max: 3, hint: 'Up to 3 more – they auto-slide with the cover on the site.', aspect: 'aspect-[16/10]' },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'tech', label: 'Technologies', type: 'tags', placeholder: 'React, Node.js, MongoDB', hint: 'Comma separated.' },
        { name: 'githubUrl', label: 'GitHub URL', type: 'url' },
        { name: 'liveUrl', label: 'Live demo URL', type: 'url' },
      ]}
      renderItem={(p) => (
        <div className="flex items-center gap-4">
          <Thumb src={p.image} Icon={FolderGit2} />
          <div className="min-w-0">
            <p className="truncate font-medium">{p.title}</p>
            <Chips list={p.tech.slice(0, 5)} />
          </div>
        </div>
      )}
    />
  );
}

export function SkillsManager({ items }) {
  return (
    <CrudManager
      kind="skill"
      items={items}
      addLabel="Add category"
      emptyText="No skill categories yet."
      fields={[
        { name: 'name', label: 'Category name', required: true, placeholder: 'Frontend Development' },
        { name: 'tech', label: 'Skills', type: 'tags', placeholder: 'React, JavaScript, Tailwind CSS', hint: 'Comma separated. Known names (React, Node.js, MongoDB…) get their logo automatically.' },
      ]}
      renderItem={(s) => (
        <div>
          <p className="font-medium">{s.name}</p>
          <Chips list={s.tech} />
        </div>
      )}
    />
  );
}

export function CertificationsManager({ items }) {
  return (
    <CrudManager
      kind="certification"
      items={items}
      addLabel="Add certification"
      emptyText="No certifications yet."
      fields={[
        { name: 'title', label: 'Title', required: true },
        { name: 'issuer', label: 'Issuer', required: true, placeholder: 'Microsoft' },
        { name: 'date', label: 'Date', required: true, placeholder: 'Apr 2026' },
        { name: 'image', label: 'Certificate image', type: 'image', aspect: 'aspect-[4/3]' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'credentialUrl', label: 'Credential URL', type: 'url' },
      ]}
      renderItem={(c) => (
        <div className="flex items-center gap-4">
          <Thumb src={c.image} Icon={Award} />
          <div className="min-w-0">
            <p className="truncate font-medium">{c.title}</p>
            <p className="truncate text-sm text-muted">{c.issuer} · {c.date}</p>
          </div>
        </div>
      )}
    />
  );
}
