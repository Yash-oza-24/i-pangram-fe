export function Input({ label, className = '', ...props }) {
  return (
    <label className="block space-y-1.5">
      {label && <span className="text-sm font-medium text-ink-muted">{label}</span>}
      <input
        className={`w-full rounded-lg border border-surface-border bg-surface px-3 py-2.5 text-ink placeholder:text-ink-muted/50 transition-colors focus:border-accent focus:bg-surface-raised focus:outline-none focus:ring-1 focus:ring-accent/30 ${className}`}
        {...props}
      />
    </label>
  );
}

export function Textarea({ label, className = '', ...props }) {
  return (
    <label className="block space-y-1.5">
      {label && <span className="text-sm font-medium text-ink-muted">{label}</span>}
      <textarea
        className={`w-full resize-none rounded-lg border border-surface-border bg-surface px-3 py-2.5 text-ink placeholder:text-ink-muted/50 transition-colors focus:border-accent focus:bg-surface-raised focus:outline-none focus:ring-1 focus:ring-accent/30 ${className}`}
        rows={3}
        {...props}
      />
    </label>
  );
}

export function Select({ label, children, className = '', ...props }) {
  return (
    <label className="block space-y-1.5">
      {label && <span className="text-sm font-medium text-ink-muted">{label}</span>}
      <select
        className={`w-full rounded-lg border border-surface-border bg-surface px-3 py-2.5 text-ink transition-colors focus:border-accent focus:bg-surface-raised focus:outline-none focus:ring-1 focus:ring-accent/30 ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
