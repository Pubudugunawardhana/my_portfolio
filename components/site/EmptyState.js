export function EmptyState({ icon: Icon, title, children }) {
  return (
    <div className="card flex flex-col items-center justify-center px-6 py-16 text-center">
      {Icon && <Icon className="mb-4 h-10 w-10 text-muted/50" />}
      <p className="font-medium">{title}</p>
      {children && <p className="mt-1 text-sm text-muted">{children}</p>}
    </div>
  );
}
