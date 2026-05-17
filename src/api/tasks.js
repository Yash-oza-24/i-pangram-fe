import { api } from './client.js';

function qs(params) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v) q.set(k, v);
  });
  const s = q.toString();
  return s ? `?${s}` : '';
}

export const tasksApi = {
  list: (filters = {}) => api(`/tasks${qs(filters)}`),
  completed: (filters = {}) => api(`/tasks/completed${qs(filters)}`),
  create: (body, socketId) =>
    api('/tasks', { method: 'POST', body, socketId }),
  update: (id, body, socketId) =>
    api(`/tasks/${id}`, { method: 'PUT', body, socketId }),
  remove: (id, eventId, socketId) =>
    api(`/tasks/${id}`, { method: 'DELETE', body: { eventId }, socketId }),
  comment: (id, body, socketId) =>
    api(`/tasks/${id}/comments`, { method: 'POST', body, socketId }),
  addSubtask: (id, title, socketId) =>
    api(`/tasks/${id}/subtasks`, { method: 'POST', body: { title }, socketId }),
  toggleSubtask: (id, subId, socketId) =>
    api(`/tasks/${id}/subtasks/${subId}`, { method: 'PATCH', socketId }),
  activity: (id) => api(`/tasks/${id}/activity`),
  recentActivity: () => api('/tasks/activity/recent'),
};
