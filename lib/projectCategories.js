// Helpers for project and certification categories. The categories live in the
// database (managed from the admin) and are passed in as `categories`.

// An item's (project or certification) category key; missing or deleted keys fall back to the first category.
export function itemCategory(item, categories = []) {
  if (categories.some((c) => c.key === item.category)) return item.category;
  return categories[0]?.key ?? item.category ?? '';
}

export function categoryName(key, categories = []) {
  return categories.find((c) => c.key === key)?.name ?? '';
}

// Turn a name into a stable key, e.g. "QA Automation" → "qa-automation".
export function slugify(name) {
  return (
    name
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'category'
  );
}
