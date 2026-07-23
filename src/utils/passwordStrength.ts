export type PasswordChecks = {
  minLength: boolean;
  hasNumber: boolean;
  hasUppercase: boolean;
  hasSpecial: boolean;
};

export type PasswordStrength = 'empty' | 'weak' | 'fair' | 'strong';

export function getPasswordChecks(password: string): PasswordChecks {
  return {
    minLength: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };
}

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return 'empty';
  const checks = getPasswordChecks(password);
  const score = Object.values(checks).filter(Boolean).length;
  if (score <= 1) return 'weak';
  if (score <= 3) return 'fair';
  return 'strong';
}

export function passwordsMatch(password: string, confirm: string): boolean {
  return password.length > 0 && password === confirm;
}
