import {useState, type InputHTMLAttributes, type ReactNode} from 'react';
import {Eye, EyeOff} from 'lucide-react';
import {FormField} from '../FormField/FormField';
import styles from './PasswordField.module.css';

type PasswordFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string;
  error?: string;
  labelExtra?: ReactNode;
};

export function PasswordField({label, error, labelExtra, ...rest}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <FormField
      {...rest}
      label={label}
      error={error}
      labelExtra={labelExtra}
      type={visible ? 'text' : 'password'}
      autoComplete={rest.autoComplete || 'current-password'}
      rightSlot={
        <button
          type="button"
          className={styles.toggle}
          aria-label={visible ? 'Hide password' : 'Show password'}
          onClick={() => setVisible(v => !v)}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      }
    />
  );
}
