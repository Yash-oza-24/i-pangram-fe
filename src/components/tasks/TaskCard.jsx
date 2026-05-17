import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { selectTask, clearTaskSelection } from '../../store/tasksSlice.js';
import { Badge } from '../ui/Badge.jsx';
import { Avatar } from '../ui/Avatar.jsx';

const priorityAccent = {
  high: 'border-l-rose-500',
  medium: 'border-l-amber-400',
  low: 'border-l-emerald-400',
};

const statusDot = {
  todo: 'bg-slate-400',
  in_progress: 'bg-sky-500',
  done: 'bg-emerald-500',
};

export function TaskCard({ task, onToggle, onDelete }) {
  const selectedId = useSelector((s) => s.tasks.selectedId);
  const dispatch = useDispatch();
  const isSelected = selectedId === task.id;
  const assignee = typeof task.assignee === 'object' ? task.assignee : null;
  const subtaskDone = task.subtasks?.filter((s) => s.done).length || 0;
  const subtaskTotal = task.subtasks?.length || 0;

  const handleSelect = () => {
    if (isSelected) {
      dispatch(clearTaskSelection());
    } else {
      dispatch(selectTask(task.id));
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={handleSelect}
      className={`group relative cursor-pointer rounded-lg border bg-surface-raised transition-colors ${priorityAccent[task.priority]} border-l-4 ${
        isSelected
          ? 'border-l-accent bg-accent/[0.06]'
          : 'border-surface-border hover:bg-surface-border/10'
      } ${task._pending ? 'opacity-70' : ''}`}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <input
          type="checkbox"
          checked={task.status === 'done'}
          onChange={(e) => {
            e.stopPropagation();
            onToggle(task);
          }}
          onClick={(e) => e.stopPropagation()}
          className="h-4 w-4 shrink-0 rounded border-surface-border text-accent focus:ring-accent"
        />

        <span className={`h-2 w-2 shrink-0 rounded-full ${statusDot[task.status]}`} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3
              className={`truncate font-medium ${task.status === 'done' ? 'text-ink-muted line-through' : 'text-ink'}`}
            >
              {task.title}
            </h3>
            {task.isOverdue && (
              <span className="shrink-0 text-[10px] font-semibold uppercase text-rose-600">
                Overdue
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
            <Badge kind="priority" value={task.priority} />
            {assignee && (
              <span className="flex items-center gap-1">
                <Avatar name={assignee.name} color={assignee.avatarColor} size="sm" />
                {assignee.name}
              </span>
            )}
            {task.dueDate && (
              <span>Due {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            )}
            {subtaskTotal > 0 && (
              <span>
                {subtaskDone}/{subtaskTotal} steps
              </span>
            )}
            {(task.comments?.length || 0) > 0 && (
              <span>{task.comments.length} comments</span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task);
          }}
          className="shrink-0 rounded-md px-2 py-1 text-xs text-ink-muted opacity-0 transition-opacity hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100 dark:hover:bg-rose-950"
        >
          Delete
        </button>
      </div>
    </motion.article>
  );
}
