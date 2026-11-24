'use client';

import { Award, FolderGit2 } from 'lucide-react';
import { CrudManager } from './CrudManager';
import { categoryName, itemCategory } from '@/lib/projectCategories';

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

// Badge colors cycle through this list in category order.
const BADGE_COLORS = [
  'bg-accent-soft text-accent',
  'bg-emerald-500/10 text-emerald-500',
  'bg-amber-500/10 text-amber-500',
  'bg-fuchsia-500/10 text-fuchsia-500',
  'bg-sky-500/10 text-sky-500',
  'bg-rose-500/10 text-rose-500',
];

function CategoryBadge({ categoryKey, categories }) {
  const index = Math.max(0, categories.findIndex((c) => c.key === categoryKey));
  return (
    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${BADGE_COLORS[index % BADGE_COLORS.length]}`}>
      {categoryName(categoryKey, categories)}
    </span>
  );
}

// Category list for one section. `kind` is projectCategory or certificationCategory;
// `entries` are the projects/certifications, used to show how many each category has.
export function CategoriesManager({ kind, items, entries, noun, placeholder }) {
  const countFor = (key) => entries.filter((e) => itemCategory(e, items) === key).length;
  return (
    <CrudManager
      kind={kind}
      items={items}
      addLabel="Add category"
      emptyText="No categories yet."
      fields={[{ name: 'name', label: 'Category name', required: true, placeholder }]}
      renderItem={(c) => (
        <div className="flex items-center gap-3">
          <CategoryBadge categoryKey={c.key} categories={items} />
          <span className="text-sm text-muted">
            {countFor(c.key)} {noun}{countFor(c.key) === 1 ? '' : 's'}
          </span>
        </div>
      )}
    />
  );
}

const categoryField = (categories, section) => ({
  name: 'category',
  label: 'Category',
  type: 'select',
  required: true,
  options: categories.map((c) => ({ value: c.key, label: c.name })),
  hint: `Decides which tab this appears under in the ${section} section. Manage categories above.`,
});

export function ProjectsManager({ items, categories }) {
  return (
    <CrudManager
      kind="project"
      items={items}
      addLabel="Add project"
      emptyText="No projects yet — add your first one."
      fields={[
        { name: 'title', label: 'Title', required: true },
        categoryField(categories, 'Projects'),
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
            <p className="flex items-center gap-2">
              <span className="truncate font-medium">{p.title}</span>
              <CategoryBadge categoryKey={itemCategory(p, categories)} categories={categories} />
            </p>
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

export function CertificationsManager({ items, categories }) {
  return (
    <CrudManager
      kind="certification"
      items={items}
      addLabel="Add certification"
      emptyText="No certifications yet."
      fields={[
        { name: 'title', label: 'Title', required: true },
        categoryField(categories, 'Certifications'),
        { name: 'issuer', label: 'Issuer', required: true, placeholder: 'Microsoft' },
        { name: 'date', label: 'Date', required: true, placeholder: 'Apr 2026' },
        { name: 'image', label: 'Certificate', type: 'image', aspect: 'aspect-[4/3]', pdfField: 'pdfUrl', hint: 'Upload an image, or the certificate PDF – its first page is shown on the site and the PDF can be opened from it.' },
        { name: 'pdfUrl', type: 'hidden' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'credentialUrl', label: 'Credential URL', type: 'url' },
      ]}
      renderItem={(c) => (
        <div className="flex items-center gap-4">
          <Thumb src={c.image} Icon={Award} />
          <div className="min-w-0">
            <p className="flex items-center gap-2">
              <span className="truncate font-medium">{c.title}</span>
              <CategoryBadge categoryKey={itemCategory(c, categories)} categories={categories} />
            </p>
            <p className="truncate text-sm text-muted">{c.issuer} · {c.date}</p>
          </div>
        </div>
      )}
    />
  );
}
