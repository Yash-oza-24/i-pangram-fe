import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { tasksApi } from '../../api/tasks.js';
import { tasksSelectors } from '../../store/tasksSlice.js';
import { DrawerOverlay } from '../ui/Drawer.jsx';
import { Button } from '../ui/Button.jsx';
import { Input, Select, Textarea } from '../ui/Input.jsx';
import { Avatar } from '../ui/Avatar.jsx';
import { Badge } from '../ui/Badge.jsx';

export function TaskDetail({ users, onUpdate, onComment, onClose, socketRef }) {
  const selectedId = useSelector((s) => s.tasks.selectedId);
  const task = useSelector((s) =>
    selectedId ? tasksSelectors.selectById(s, selectedId) : null
  );
  const currentUser = useSelector((s) => s.auth.user);
  const [comment, setComment] = useState('');
  const [subtaskTitle, setSubtaskTitle] = useState('');
  const [activity, setActivity] = useState([]);

  const open = Boolean(selectedId && task);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  useEffect(() => {
    setComment('');
    setSubtaskTitle('');
    setActivity([]);
  }, [selectedId]);

  const loadActivity = async () => {
    if (!task) return;
    const { activity: logs } = await tasksApi.activity(task.id);
    setActivity(logs);
  };

  const handleSubtask = async () => {
    if (!subtaskTitle.trim() || !task) return;
    await tasksApi.addSubtask(task.id, subtaskTitle.trim(), socketRef.current?.id);
    setSubtaskTitle('');
  };

  const toggleSubtask = async (subId) => {
    if (!task) return;
    await tasksApi.toggleSubtask(task.id, subId, socketRef.current?.id);
  };

  if (!open) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[90]">
        <DrawerOverlay onClose={onClose} />

        <motion.aside
          key={task.id}
          role="dialog"
          aria-modal="true"
          aria-label="Task details"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 34, stiffness: 380 }}
          className="drawer-panel fixed inset-y-0 right-0 z-[91] flex w-full max-w-lg flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <header className="drawer-header flex shrink-0 items-start justify-between gap-3 px-6 py-5">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">
                Task details
              </p>
              <h2 className="mt-1 line-clamp-2 text-xl font-semibold tracking-tight">
                {task.title}
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge kind="priority" value={task.priority} />
                <Badge kind="status" value={task.status} />
                {task.isOverdue && (
                  <span className="text-xs font-medium text-rose-600">Overdue</span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="drawer-close-btn shrink-0"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            <Textarea
              label="Description"
              value={task.description || ''}
              onChange={(e) => onUpdate(task.id, { description: e.target.value })}
            />

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Select
                label="Status"
                value={task.status}
                onChange={(e) => onUpdate(task.id, { status: e.target.value })}
              >
                <option value="todo">To do</option>
                <option value="in_progress">In progress</option>
                <option value="done">Done</option>
              </Select>
              <Select
                label="Priority"
                value={task.priority}
                onChange={(e) => onUpdate(task.id, { priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
              <Select
                label="Assignee"
                value={task.assignee?.id || task.assignee || ''}
                onChange={(e) => onUpdate(task.id, { assignee: e.target.value || null })}
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </Select>
              <Input
                label="Due date"
                type="date"
                value={task.dueDate ? task.dueDate.slice(0, 10) : ''}
                onChange={(e) =>
                  onUpdate(task.id, {
                    dueDate: e.target.value ? new Date(e.target.value).toISOString() : null,
                  })
                }
              />
            </div>

            <section className="mt-6">
              <h3 className="mb-2 text-sm font-semibold">Subtasks</h3>
              <ul className="space-y-1 rounded-lg border border-surface-border bg-surface p-2">
                {(task.subtasks || []).length === 0 && (
                  <li className="px-2 py-1.5 text-xs text-ink-muted">No subtasks yet</li>
                )}
                {(task.subtasks || []).map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-surface-border/30"
                  >
                    <input
                      type="checkbox"
                      checked={s.done}
                      onChange={() => toggleSubtask(s.id)}
                      className="h-4 w-4 rounded text-accent"
                    />
                    <span className={s.done ? 'text-ink-muted line-through' : ''}>{s.title}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex gap-2">
                <Input
                  placeholder="Add subtask…"
                  value={subtaskTitle}
                  onChange={(e) => setSubtaskTitle(e.target.value)}
                  className="flex-1"
                />
                <Button type="button" variant="outline" size="sm" onClick={handleSubtask}>
                  Add
                </Button>
              </div>
            </section>

            <section className="mt-6">
              <h3 className="mb-2 text-sm font-semibold">Comments</h3>
              <ul className="max-h-48 space-y-3 overflow-y-auto rounded-lg border border-surface-border bg-surface p-3">
                {(task.comments || []).length === 0 && (
                  <li className="text-xs text-ink-muted">No comments yet</li>
                )}
                {(task.comments || []).map((c) => (
                  <li key={c.id} className="flex gap-2 text-sm">
                    <Avatar name={c.author?.name} color={c.author?.avatarColor} size="sm" />
                    <div>
                      <p className="font-medium">{c.author?.name}</p>
                      <p className="text-ink-muted">{c.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <form
                className="mt-3 flex gap-2"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!comment.trim()) return;
                  await onComment(task.id, comment.trim());
                  setComment('');
                }}
              >
                <Input
                  placeholder="Write a comment…"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="sm">
                  Post
                </Button>
              </form>
            </section>

            <section className="mt-6 pb-2">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Activity</h3>
                <Button variant="ghost" size="sm" onClick={loadActivity}>
                  Load
                </Button>
              </div>
              <ul className="max-h-36 space-y-2 overflow-y-auto rounded-lg border border-surface-border bg-surface p-3 text-xs text-ink-muted">
                {activity.length === 0 && <li>Click load to see history</li>}
                {activity.map((log) => (
                  <li key={log._id}>
                    <span className="font-medium text-ink">{log.actor?.name}</span> — {log.summary}
                    <time className="ml-1 block sm:inline">
                      {new Date(log.createdAt).toLocaleString()}
                    </time>
                  </li>
                ))}
              </ul>
            </section>

            {currentUser?.role === 'admin' && (
              <p className="mt-4 text-xs text-ink-muted">Admin access — you can edit any task</p>
            )}
          </div>
        </motion.aside>
      </div>
    </AnimatePresence>,
    document.body
  );
}
