import { api } from './client.js';

export const notificationsApi = {
  list: (page = 1) => api(`/notifications?page=${page}`),
  unread: () => api('/notifications/unread'),
  markRead: (id) => api(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllRead: () => api('/notifications/read-all', { method: 'PATCH' }),
};
