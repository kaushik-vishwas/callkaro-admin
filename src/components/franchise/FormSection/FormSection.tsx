import type {ReactNode} from 'react';
import styles from './FormSection.module.css';

type FormSectionProps = {
  title: string;
  children: ReactNode;
  description?: string;
};

export function FormSection({title, description, children}: FormSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <h2 className={styles.title}>{title}</h2>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>
      <div className={styles.body}>{children}</div>
    </section>
  );
}
