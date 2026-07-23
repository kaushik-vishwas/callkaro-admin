const PRODUCTION_API_BASE_URL = 'https://callkaro.delicod.com/api';

export function getApiBaseUrl(): string {
  const fromEnv = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  if (import.meta.env.DEV) return '/ck-api';
  return PRODUCTION_API_BASE_URL;
}
