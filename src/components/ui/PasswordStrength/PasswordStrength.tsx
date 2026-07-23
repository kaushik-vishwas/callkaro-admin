import {Check, Circle} from 'lucide-react';
import {
  getPasswordChecks,
  getPasswordStrength,
  type PasswordStrength,
} from '../../../utils/passwordStrength';
import styles from './PasswordStrength.module.css';

const LABELS: Record<Exclude<PasswordStrength, 'empty'>, string> = {
  weak: 'Weak',
  fair: 'Fair',
  strong: 'Strong',
};

type PasswordStrengthProps = {
  password: string;
};

export function PasswordStrengthMeter({password}: PasswordStrengthProps) {
  const strength = getPasswordStrength(password);
  const checks = getPasswordChecks(password);

  const requirements = [
    {key: 'minLength', label: '8+ characters', ok: checks.minLength},
    {key: 'hasNumber', label: 'One number', ok: checks.hasNumber},
    {key: 'hasUppercase', label: 'Uppercase letter', ok: checks.hasUppercase},
    {key: 'hasSpecial', label: 'Special character', ok: checks.hasSpecial},
  ] as const;

  return (
    <div className={styles.wrap}>
      <div className={styles.meterRow}>
        <div className={styles.track} aria-hidden>
          <span
            className={[
              styles.fill,
              strength === 'empty' ? '' : styles[strength],
            ]
              .filter(Boolean)
              .join(' ')}
          />
        </div>
        <span
          className={[
            styles.label,
            strength === 'empty' ? '' : styles[`${strength}Text`],
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {strength === 'empty' ? 'Strength' : LABELS[strength]}
        </span>
      </div>

      <ul className={styles.grid}>
        {requirements.map(item => (
          <li
            key={item.key}
            className={[styles.req, item.ok ? styles.reqOk : ''].join(' ')}
          >
            {item.ok ? (
              <Check size={14} strokeWidth={3} />
            ) : (
              <Circle size={12} strokeWidth={2} />
            )}
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
