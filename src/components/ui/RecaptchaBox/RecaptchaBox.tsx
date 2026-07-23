import styles from './RecaptchaBox.module.css';

type RecaptchaBoxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

/** Visual reCAPTCHA stand-in matching the Figma block (wire real keys later). */
export function RecaptchaBox({checked, onChange}: RecaptchaBoxProps) {
  return (
    <div className={styles.box}>
      <label className={styles.left}>
        <input
          type="checkbox"
          checked={checked}
          onChange={event => onChange(event.target.checked)}
          className={styles.checkbox}
        />
        <span>I'm not a robot</span>
      </label>
      <div className={styles.brand} aria-hidden>
        <span className={styles.logo}>reCAPTCHA</span>
        <span className={styles.meta}>Privacy · Terms</span>
      </div>
    </div>
  );
}
