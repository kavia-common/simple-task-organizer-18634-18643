import { getApiBaseUrl, getAuthToken, setAuthToken, clearAuthToken } from '../config';

function buildHeaders(isJson = true) {
  const headers = {};
  if (isJson) headers['Content-Type'] = 'application/json';
  const token = getAuthToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function handleResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await res.json().catch(() => ({})) : await res.text().catch(() => '');
  if (!res.ok) {
    const message = (data && (data.message || data.error)) || `Request failed with status ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

// PUBLIC_INTERFACE
export async function signup({ email, password }) {
  /** Signup user. Expects backend endpoint POST /auth/signup { email, password } returning { token } */
  const res = await fetch(`${getApiBaseUrl()}/auth/signup`, {
    method: 'POST',
    headers: buildHeaders(true),
    body: JSON.stringify({ email, password, emailRedirectTo: window.location.origin })
  });
  const data = await handleResponse(res);
  if (data?.token) setAuthToken(data.token);
  return data;
}

// PUBLIC_INTERFACE
export async function login({ email, password }) {
  /** Login user. Expects backend endpoint POST /auth/login { email, password } returning { token } */
  const res = await fetch(`${getApiBaseUrl()}/auth/login`, {
    method: 'POST',
    headers: buildHeaders(true),
    body: JSON.stringify({ email, password })
  });
  const data = await handleResponse(res);
  if (data?.token) setAuthToken(data.token);
  return data;
}

// PUBLIC_INTERFACE
export function logout() {
  /** Logs out locally by clearing token. */
  clearAuthToken();
}

// PUBLIC_INTERFACE
export async function getTasks() {
  /** Fetch list of tasks. GET /tasks -> [{id,title,description,completed,createdAt}] */
  const res = await fetch(`${getApiBaseUrl()}/tasks`, {
    headers: buildHeaders(false)
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function createTask(payload) {
  /** Create a task. POST /tasks */
  const res = await fetch(`${getApiBaseUrl()}/tasks`, {
    method: 'POST',
    headers: buildHeaders(true),
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function updateTask(id, payload) {
  /** Update a task. PUT /tasks/{id} */
  const res = await fetch(`${getApiBaseUrl()}/tasks/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: buildHeaders(true),
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function deleteTask(id) {
  /** Delete a task. DELETE /tasks/{id} */
  const res = await fetch(`${getApiBaseUrl()}/tasks/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: buildHeaders(false)
  });
  return handleResponse(res);
}
