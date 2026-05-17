import { useQuery } from '@tanstack/react-query';
import { tasksApi } from '../../api/tasks.js';

export function ActivityFeed() {
  const { data, isLoading } = useQuery({
    queryKey: ['activity', 'recent'],
    queryFn: () => tasksApi.recentActivity(),
    refetchInterval: 60_000,
  });

  const logs = data?.activity || [];

  return (
    <aside className="rounded-xl border border-surface-border bg-surface-raised p-4 shadow-card">
      <h2 className="mb-3 font-semibold">Team activity</h2>
      {isLoading ? (
        <p className="text-sm text-ink-muted">Loading…</p>
      ) : logs.length === 0 ? (
        <p className="text-sm text-ink-muted">No activity yet</p>
      ) : (
        <ul className="max-h-80 space-y-3 overflow-y-auto text-sm">
          {logs.map((log) => (
            <li key={log._id} className="border-b border-surface-border/60 pb-2 last:border-0">
              <p>
                <span className="font-medium">{log.actor?.name}</span>{' '}
                <span className="text-ink-muted">{log.summary}</span>
              </p>
              <time className="text-xs text-ink-muted">
                {new Date(log.createdAt).toLocaleString()}
              </time>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
