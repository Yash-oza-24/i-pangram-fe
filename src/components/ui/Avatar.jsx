export function Avatar({ name, color = '#6366f1', size = 'md' }) {
  const initials = name
    ?.split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const sizeClass = size === 'sm' ? 'h-7 w-7 text-xs' : 'h-9 w-9 text-sm';

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${sizeClass}`}
      style={{ backgroundColor: color }}
      title={name}
    >
      {initials}
    </span>
  );
}
