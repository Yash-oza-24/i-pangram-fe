import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { authApi } from '../api/auth.js';
import { tasksApi } from '../api/tasks.js';
import { notificationsApi } from '../api/notifications.js';
import { setTasks, clearTaskSelection } from '../store/tasksSlice.js';
import { setNotifications } from '../store/notificationsSlice.js';
import { tasksSelectors } from '../store/tasksSlice.js';
import { setShowActivity, setShowCompleted } from '../store/uiSlice.js';
import { useSocket } from '../hooks/useSocket.js';
import { useOfflineSync } from '../hooks/useOfflineSync.js';
import { useTaskMutations } from '../hooks/useTaskMutations.js';
import { TaskFilters } from '../components/tasks/TaskFilters.jsx';
import { AddTaskPanel } from '../components/tasks/AddTaskPanel.jsx';
import { TaskCard } from '../components/tasks/TaskCard.jsx';
import { TaskDetail } from '../components/tasks/TaskDetail.jsx';
import { ActivityFeed } from '../components/tasks/ActivityFeed.jsx';
import { Button } from '../components/ui/Button.jsx';

function PlusIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

export function DashboardPage() {
  const dispatch = useDispatch();
  const filters = useSelector((s) => s.tasks.filters);
  const selectedId = useSelector((s) => s.tasks.selectedId);
  const showActivity = useSelector((s) => s.ui.showActivity);
  const showCompleted = useSelector((s) => s.ui.showCompleted);
  const [creating, setCreating] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const socketRef = useSocket();
  useOfflineSync(socketRef);
  const { createTask, updateTask, deleteTask, addComment } = useTaskMutations(socketRef);

  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => authApi.users(),
  });

  useQuery({
    queryKey: ['tasks', filters],
    queryFn: async () => {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v)
      );
      const { tasks } = await tasksApi.list(params);
      dispatch(setTasks(tasks));
      return tasks;
    },
  });

  useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { items } = await notificationsApi.list();
      dispatch(setNotifications(items));
      return items;
    },
  });

  const { data: completedData } = useQuery({
    queryKey: ['tasks', 'completed'],
    queryFn: () => tasksApi.completed(),
    enabled: showCompleted,
  });

  const allTasks = useSelector(tasksSelectors.selectAll);

  const filteredTasks = useMemo(() => {
    return allTasks.filter((t) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const hay = `${t.title} ${t.description || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filters.status && t.status !== filters.status) return false;
      if (filters.priority && t.priority !== filters.priority) return false;
      if (filters.assignee) {
        const aid = t.assignee?.id || t.assignee;
        if (aid !== filters.assignee) return false;
      }
      return true;
    });
  }, [allTasks, filters]);

  const users = usersData?.users || [];
  const overdueCount = filteredTasks.filter((t) => t.isOverdue).length;

  const handleCloseDetail = () => dispatch(clearTaskSelection());

  const openAddPanel = () => {
    handleCloseDetail();
    setAddOpen(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="mt-0.5 text-sm text-ink-muted">
            {filteredTasks.length} showing
            {overdueCount > 0 && (
              <span className="ml-2 font-medium text-rose-600">· {overdueCount} overdue</span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch(setShowActivity(!showActivity))}
          >
            {showActivity ? 'Hide activity' : 'Activity'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch(setShowCompleted(!showCompleted))}
          >
            {showCompleted ? 'Hide archive' : 'Archive'}
          </Button>
          <Button onClick={openAddPanel} className="shadow-md">
            <PlusIcon />
            Add task
          </Button>
        </div>
      </div>

      <TaskFilters users={users} />

      <section className="rounded-xl border border-surface-border bg-surface-raised shadow-card">
        <div className="border-b border-surface-border px-4 py-3 sm:px-5">
          <h2 className="text-sm font-semibold text-ink">All tasks</h2>
        </div>

        <div className="max-h-[calc(100vh-14rem)] space-y-1.5 overflow-y-auto p-3 sm:p-4">
          <AnimatePresence initial={false}>
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={(t) =>
                  updateTask(t.id, {
                    status: t.status === 'done' ? 'todo' : 'done',
                  })
                }
                onDelete={(t) => {
                  if (selectedId === t.id) handleCloseDetail();
                  deleteTask(t.id, t);
                }}
              />
            ))}
          </AnimatePresence>

          {filteredTasks.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-ink-muted">No tasks yet</p>
              <p className="mt-1 text-sm text-ink-muted">Create one to get started</p>
              <Button className="mt-4" onClick={openAddPanel}>
                <PlusIcon />
                Add task
              </Button>
            </div>
          )}
        </div>
      </section>

      {showActivity && (
        <div className="max-w-xl">
          <ActivityFeed />
        </div>
      )}

      {showCompleted && (
        <section className="rounded-xl border border-surface-border bg-surface-raised p-4 shadow-card">
          <h2 className="mb-3 font-semibold">Completed archive</h2>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {(completedData?.tasks || []).map((t) => (
              <li
                key={t._id}
                className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm"
              >
                <span className="font-medium">{t.title}</span>
                <span className="mt-0.5 block text-xs text-ink-muted">
                  {new Date(t.completedAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <TaskDetail
        users={users}
        onUpdate={updateTask}
        onComment={addComment}
        onClose={handleCloseDetail}
        socketRef={socketRef}
      />

      <AddTaskPanel
        open={addOpen}
        onClose={() => setAddOpen(false)}
        users={users}
        loading={creating}
        onSubmit={async (payload) => {
          setCreating(true);
          try {
            await createTask(payload);
          } finally {
            setCreating(false);
          }
        }}
      />
    </div>
  );
}
