// Loose comparison for technology names typed in different places, so the skill
// "React" matches a project's "React.js" or "React 19", "Node.js" matches "Node",
// "HTML" matches "HTML5" and "C" matches "C (Programming Language)".
export function normalizeTech(name = '') {
  let n = name
    .toLowerCase()
    .replace(/\(.*?\)/g, '') // drop notes in brackets
    .replace(/[^a-z0-9+#]/g, ''); // keep letters, digits, + and # (C++, C#)
  if (n.length > 2) n = n.replace(/js$/, ''); // React.js → react (but keep "js")
  if (n.length > 1) n = n.replace(/\d+$/, ''); // HTML5 → html, React 19 → react
  return ALIASES[n] ?? n;
}

const ALIASES = { js: 'javascript', ts: 'typescript', mongo: 'mongodb', postgres: 'postgresql', tailwind: 'tailwindcss' };

export const sameTech = (a, b) => normalizeTech(a) !== '' && normalizeTech(a) === normalizeTech(b);

export const projectsUsing = (tech, projects) => projects.filter((p) => (p.tech ?? []).some((t) => sameTech(t, tech)));
