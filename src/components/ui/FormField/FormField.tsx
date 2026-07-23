import type {InputHTMLAttributes, ReactNode} from 'react';
import styles from './FormField.module.css';

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: ReactNode;
  labelExtra?: ReactNode;
  rightSlot?: ReactNode;
};

export function FormField({
  label,
  error,
  hint,
  labelExtra,
  rightSlot,
  id,
  className = '',
  ...rest
}: FormFieldProps) {
  const fieldId = id || rest.name || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={styles.field}>
      <div className={styles.labelRow}>
        <label className={styles.label} htmlFor={fieldId}>
          {label}
        </label>
        {labelExtra}
      </div>
      <div className={[styles.control, error ? styles.invalid : ''].join(' ')}>
        <input id={fieldId} className={[styles.input, className].join(' ')} {...rest} />
        {rightSlot ? <div className={styles.rightSlot}>{rightSlot}</div> : null}
      </div>
      {error ? <p className={styles.error}>{error}</p> : null}
      {!error && hint ? <div className={styles.hint}>{hint}</div> : null}
    </div>
  );
}
