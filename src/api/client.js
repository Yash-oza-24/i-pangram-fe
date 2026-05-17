const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function getToken() {
  return localStorage.getItem('token');
}

export async function api(path, options = {}) {
  const { socketId, body, headers: extraHeaders, ...fetchOptions } = options;

  const headers = {
    'Content-Type': 'application/json',
    ...extraHeaders,
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (socketId) headers['X-Socket-Id'] = socketId;

  const res = await fetch(`${BASE}${path}`, {
    ...fetchOptions,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}
