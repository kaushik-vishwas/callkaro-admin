import styles from './CallerAvatar.module.css';

const tones = ['pink', 'violet', 'teal', 'amber', 'blue'] as const;

export function CallerAvatar({
  name,
  size = 'md',
}: {
  name: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const initial = name.trim().charAt(0).toUpperCase() || '?';
  const tone = tones[name.length % tones.length];

  return (
    <span className={[styles.avatar, styles[size], styles[tone]].join(' ')}>
      {initial}
    </span>
  );
}
