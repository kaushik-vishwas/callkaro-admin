import type {ReactNode} from 'react';
import {Phone} from 'lucide-react';
import styles from './AuthCard.module.css';

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthCard({title, subtitle, children, footer}: AuthCardProps) {
  return (
    <section className={styles.card}>
      <div className={styles.logoWrap} aria-hidden>
        <span className={styles.logo}>
          <Phone size={28} strokeWidth={2.25} />
        </span>
      </div>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </header>
      <div className={styles.body}>{children}</div>
      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </section>
  );
}
