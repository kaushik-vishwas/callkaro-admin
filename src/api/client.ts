import {getApiBaseUrl} from '../config/env';

const TOKEN_KEY = 'callkaro_admin_token';
const CHALLENGE_KEY = 'callkaro_admin_challenge';
const REMEMBER_KEY = 'callkaro_admin_remember';

export {getApiBaseUrl};

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null, remember = true) {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  if (!token) return;
  const store = remember ? localStorage : sessionStorage;
  store.setItem(TOKEN_KEY, token);
}

export function getChallengeSession(): {
  challengeToken: string;
  email: string;
  remember: boolean;
  debugOtp?: string;
} | null {
  try {
    const raw = sessionStorage.getItem(CHALLENGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as {
      challengeToken: string;
      email: string;
      remember: boolean;
      debugOtp?: string;
    };
  } catch {
    return null;
  }
}

export function setChallengeSession(
  value: {
    challengeToken: string;
    email: string;
    remember: boolean;
    debugOtp?: string;
  } | null,
) {
  if (!value) sessionStorage.removeItem(CHALLENGE_KEY);
  else sessionStorage.setItem(CHALLENGE_KEY, JSON.stringify(value));
}

export function getRememberPreference(): boolean {
  const raw = localStorage.getItem(REMEMBER_KEY);
  if (raw === null) return true;
  return raw === '1';
}

export function setRememberPreference(remember: boolean) {
  localStorage.setItem(REMEMBER_KEY, remember ? '1' : '0');
}

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
  statusCode?: number;
} & T;

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getStoredToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers,
  });

  let payload: ApiResponse<T> | null = null;
  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError('Invalid server response.', response.status);
  }

  if (!response.ok || payload?.success === false) {
    throw new ApiError(
      payload?.message || `Request failed (${response.status})`,
      payload?.statusCode || response.status,
    );
  }

  if (payload.data !== undefined) return payload.data;
  const {success: _s, message: _m, statusCode: _c, ...rest} = payload as ApiResponse<T> &
    Record<string, unknown>;
  return rest as T;
}
