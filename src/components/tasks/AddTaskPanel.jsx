import { useState } from 'react';
import { Drawer } from '../ui/Drawer.jsx';
import { Button } from '../ui/Button.jsx';
import { Input, Select, Textarea } from '../ui/Input.jsx';

const empty = {
  title: '',
  description: '',
  priority: 'medium',
  assignee: '',
  dueDate: '',
};

export function AddTaskPanel({ open, onClose, users = [], onSubmit, loading }) {
  const [form, setForm] = useState(empty);

  const handleClose = () => {
    setForm(empty);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    await onSubmit({
      title: form.title.trim(),
      description: form.description,
      priority: form.priority,
      status: 'todo',
      assignee: form.assignee || null,
      dueDate: form.dueDate || null,
    });
    setForm(empty);
    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      title="Create task"
      subtitle="New"
      footer={
        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-task-form"
            className="flex-1"
            disabled={loading || !form.title.trim()}
          >
            {loading ? 'Creating…' : 'Create task'}
          </Button>
        </div>
      }
    >
      <form
        id="add-task-form"
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col overflow-y-auto px-6 pb-6"
      >
        <div className="space-y-5">
          <Input
            label="Title"
            placeholder="What needs to be done?"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            autoFocus
            required
          />
          <Textarea
            label="Description"
            placeholder="Add context, links, or notes…"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="min-h-[96px]"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Priority"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
            <Select
              label="Assign to"
              value={form.assignee}
              onChange={(e) => setForm({ ...form, assignee: e.target.value })}
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </Select>
          </div>
          <Input
            label="Due date"
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />
        </div>
      </form>
    </Drawer>
  );
}
