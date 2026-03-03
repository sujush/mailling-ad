import { useState } from 'react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const styles = {
  form: {
    background: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: '6px',
    padding: '16px',
    marginBottom: '16px',
  },
  title: { margin: '0 0 12px', fontSize: '15px', fontWeight: '600', color: '#495057' },
  row: { display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' },
  field: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '160px' },
  label: { fontSize: '12px', fontWeight: '500', color: '#6c757d' },
  input: {
    padding: '7px 10px',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    fontSize: '14px',
    outline: 'none',
  },
  inputError: { borderColor: '#dc3545' },
  errorText: { fontSize: '11px', color: '#dc3545', marginTop: '2px' },
  btnRow: { display: 'flex', gap: '8px', marginTop: '4px' },
  btnPrimary: {
    padding: '7px 16px',
    background: '#0d6efd',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  btnSecondary: {
    padding: '7px 16px',
    background: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default function RecipientForm({ onSubmit, onCancel, initialData = null }) {
  const [email, setEmail] = useState(initialData?.email || '');
  const [name, setName] = useState(initialData?.name || '');
  const [tags, setTags] = useState(initialData?.tags || '');
  const [emailError, setEmailError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    if (!email.trim()) {
      setEmailError('이메일은 필수입니다.');
      return false;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      setEmailError('올바른 이메일 형식이 아닙니다.');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({ email: email.trim(), name: name.trim(), tags: tags.trim() });
      if (!initialData) {
        setEmail('');
        setName('');
        setTags('');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <p style={styles.title}>{initialData ? '수신자 수정' : '수신자 추가'}</p>
      <div style={styles.row}>
        <div style={styles.field}>
          <label style={styles.label}>이메일 *</label>
          <input
            style={{ ...styles.input, ...(emailError ? styles.inputError : {}) }}
            type="text"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
            placeholder="user@example.com"
            disabled={!!initialData}
          />
          {emailError && <span style={styles.errorText}>{emailError}</span>}
        </div>
        <div style={styles.field}>
          <label style={styles.label}>이름</label>
          <input
            style={styles.input}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="홍길동"
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>태그 (쉼표 구분)</label>
          <input
            style={styles.input}
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="VIP, 신규"
          />
        </div>
        <div style={styles.btnRow}>
          <button type="submit" style={styles.btnPrimary} disabled={submitting}>
            {submitting ? '처리 중...' : initialData ? '저장' : '추가'}
          </button>
          {onCancel && (
            <button type="button" style={styles.btnSecondary} onClick={onCancel}>
              취소
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
