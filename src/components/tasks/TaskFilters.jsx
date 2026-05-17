import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '../../store/tasksSlice.js';
import { Input, Select } from '../ui/Input.jsx';

export function TaskFilters({ users = [] }) {
  const filters = useSelector((s) => s.tasks.filters);
  const dispatch = useDispatch();

  const update = (patch) => dispatch(setFilters(patch));

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="rounded-xl border border-surface-border bg-surface-raised p-4 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">Filters</h2>
        {hasFilters && (
          <button
            type="button"
            onClick={() =>
              dispatch(setFilters({ search: '', status: '', priority: '', assignee: '' }))
            }
            className="text-xs font-medium text-accent hover:underline"
          >
            Clear all
          </button>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Input
          placeholder="Search tasks…"
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
        />
        <Select
          value={filters.status}
          onChange={(e) => update({ status: e.target.value })}
        >
          <option value="">All statuses</option>
          <option value="todo">To do</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
        </Select>
        <Select
          value={filters.priority}
          onChange={(e) => update({ priority: e.target.value })}
        >
          <option value="">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Select>
        <Select
          value={filters.assignee}
          onChange={(e) => update({ assignee: e.target.value })}
        >
          <option value="">All assignees</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
