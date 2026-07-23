import type {ReactNode} from 'react';
import styles from './AuthLayout.module.css';

type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({children}: AuthLayoutProps) {
  return (
    <div className={styles.page}>
      <div className={styles.glow} aria-hidden />
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <p className={styles.copy}>
          Callkaro Admin © {new Date().getFullYear()} Callkaro Enterprise. All
          rights reserved.
        </p>
        <nav className={styles.links} aria-label="Legal">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#security">Security</a>
        </nav>
      </footer>
    </div>
  );
}
