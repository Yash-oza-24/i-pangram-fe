const priorityStyles = {
  high: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
  medium: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  low: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
};

const statusStyles = {
  todo: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  in_progress: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
  done: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
};

export function Badge({ children, kind = 'status', value }) {
  const styles = kind === 'priority' ? priorityStyles : statusStyles;
  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium capitalize ${styles[value] || ''}`}
    >
      {children || value?.replace('_', ' ')}
    </span>
  );
}
