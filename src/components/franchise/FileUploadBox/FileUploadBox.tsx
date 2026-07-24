import {useRef, useState} from 'react';
import {Upload} from 'lucide-react';
import styles from './FileUploadBox.module.css';

type FileUploadBoxProps = {
  label: string;
  accept?: string;
  onFileChange?: (file: File | null) => void;
};

export function FileUploadBox({
  label,
  accept = '.png,.jpg,.jpeg,.pdf',
  onFileChange,
}: FileUploadBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');

  return (
    <button
      type="button"
      className={styles.box}
      onClick={() => inputRef.current?.click()}
    >
      <span className={styles.icon}>
        <Upload size={18} />
      </span>
      <span className={styles.title}>{label}</span>
      <span className={styles.hint}>
        {fileName || 'Click to upload PNG, JPG or PDF'}
      </span>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className={styles.input}
        onChange={event => {
          const file = event.target.files?.[0] || null;
          setFileName(file?.name || '');
          onFileChange?.(file);
        }}
      />
    </button>
  );
}
