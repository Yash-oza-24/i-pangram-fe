const variants = {
  primary: 'bg-accent hover:bg-accent-hover text-white shadow-sm',
  ghost: 'bg-transparent hover:bg-surface-border/40 text-ink',
  danger: 'bg-rose-500 hover:bg-rose-600 text-white',
  outline:
    'border border-surface-border bg-surface-raised hover:bg-surface-border/30 text-ink',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
