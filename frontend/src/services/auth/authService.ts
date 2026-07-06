const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const REQUEST_TIMEOUT_MS = 15000;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export class RequestError extends Error {
  status: number;
  errors?: Array<{ field?: string; message: string }>;

  constructor(message: string, status: number, errors: Array<{ field?: string; message: string }> = []) {
    super(message);
    this.name = 'RequestError';
    this.status = status;
    this.errors = errors;
  }
}

const request = async <T>(path: string, body: Record<string, unknown> | FormData): Promise<T> => {
  const isFormData = body instanceof FormData;
  let response: Response;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: isFormData ? body : JSON.stringify(body),
      signal: controller.signal
    });
  } catch (error) {
    const message = error instanceof DOMException && error.name === 'AbortError'
      ? 'Authentication request timed out. Please check your connection and try again.'
      : 'Authentication service is unreachable. Please check your connection and try again.';
    throw new RequestError(message, 0);
  } finally {
    window.clearTimeout(timeout);
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = payload?.errors?.[0]?.message || payload?.message || `Authentication request failed with status ${response.status}.`;
    const errors = Array.isArray(payload?.errors) ? payload.errors : [];
    throw new RequestError(message, response.status, errors);
  }

  return payload.data as T;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  avatar?: File | null;
};

export const authService = {
  register: async (body: RegisterPayload) => {
    const formData = new FormData();
    formData.append('name', body.name);
    formData.append('email', body.email);
    formData.append('password', body.password);
    formData.append('confirmPassword', body.confirmPassword);
    if (body.avatar) {
      formData.append('avatar', body.avatar);
    }
    return request<AuthResponse>('/auth/register', formData);
  },
  login: (body: { email: string; password: string }) =>
    request<AuthResponse>('/auth/login', body),
  googleAuth: (body: { idToken: string }) =>
    request<AuthResponse>('/auth/google', body),
  forgotPassword: (body: { email: string }) =>
    request<null>('/auth/forgot-password', body),
  resetPassword: (token: string, body: { password: string; confirmPassword: string }) =>
    request<AuthResponse>(`/auth/reset-password/${encodeURIComponent(token)}`, body),
  logout: async () => {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      const message = payload?.errors?.[0]?.message || payload?.message || 'Logout failed.';
      throw new Error(message);
    }

    return response.json();
  }
};

export default authService;
