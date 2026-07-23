import type {InputHTMLAttributes} from 'react';
import styles from './Checkbox.module.css';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string;
};

export function Checkbox({label, id, className = '', ...rest}: CheckboxProps) {
  const fieldId = id || rest.name || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <label className={[styles.wrap, className].join(' ')} htmlFor={fieldId}>
      <input id={fieldId} type="checkbox" className={styles.input} {...rest} />
      <span className={styles.box} aria-hidden />
      <span className={styles.label}>{label}</span>
    </label>
  );
}
