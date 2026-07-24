import type {InputHTMLAttributes, ReactNode} from 'react';
import styles from './Field.module.css';

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  prefix?: ReactNode;
  readOnlyBox?: boolean;
};

export function Field({
  label,
  hint,
  prefix,
  readOnlyBox,
  className = '',
  ...rest
}: FieldProps) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      <span
        className={[
          styles.control,
          prefix ? styles.withPrefix : '',
          readOnlyBox || rest.readOnly ? styles.readOnly : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {prefix ? <span className={styles.prefix}>{prefix}</span> : null}
        <input {...rest} />
      </span>
      {hint ? <span className={styles.hint}>{hint}</span> : null}
    </label>
  );
}
