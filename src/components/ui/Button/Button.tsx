import type {ButtonHTMLAttributes, ReactNode} from 'react';
import {ArrowRight} from 'lucide-react';
import styles from './Button.module.css';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  fullWidth?: boolean;
  showArrow?: boolean;
  children: ReactNode;
};

export function Button({
  fullWidth = true,
  showArrow = false,
  className = '',
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        styles.button,
        fullWidth ? styles.fullWidth : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      <span>{children}</span>
      {showArrow ? <ArrowRight size={18} strokeWidth={2.5} /> : null}
    </button>
  );
}
