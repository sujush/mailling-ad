import { useState, useEffect } from 'react';
import { createTemplate, updateTemplate } from '../api/templateApi';

const styles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: '16px',
  },
  modal: {
    background: '#fff', borderRadius: '8px', width: '100%', maxWidth: '760px',
    maxHeight: '90vh', overflow: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 20px', borderBottom: '1px solid #dee2e6',
  },
  title: { margin: 0, fontSize: '18px', fontWeight: '700', color: '#212529' },
  closeBtn: {
    background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer',
    color: '#6c757d', lineHeight: 1, padding: '0 4px',
  },
  body: { padding: '20px' },
  fieldGroup: { marginBottom: '16px' },
  label: {
    display: 'block', marginBottom: '6px', fontSize: '13px',
    fontWeight: '600', color: '#495057',
  },
  input: {
    width: '100%', padding: '8px 12px', border: '1px solid #ced4da',
    borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  textarea: {
    width: '100%', padding: '10px 12px', border: '1px solid #ced4da',
    borderRadius: '4px', fontSize: '13px', fontFamily: 'monospace',
    resize: 'vertical', minHeight: '200px', boxSizing: 'border-box',
    lineHeight: '1.5',
  },
  varList: {
    display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px',
  },
  varBadge: {
    background: '#e7f3ff', color: '#0052cc', border: '1px solid #b3d4f5',
    borderRadius: '12px', padding: '2px 10px', fontSize: '12px', fontWeight: '500',
  },
  varHint: { fontSize: '12px', color: '#6c757d', marginTop: '6px' },
  footer: {
    display: 'flex', gap: '8px', justifyContent: 'flex-end',
    padding: '14px 20px', borderTop: '1px solid #dee2e6',
  },
  btnPrimary: {
    background: '#0d6efd', color: '#fff', border: 'none', borderRadius: '4px',
    padding: '8px 20px', fontSize: '14px', fontWeight: '500', cursor: 'pointer',
  },
  btnSecondary: {
    background: '#fff', color: '#495057', border: '1px solid #ced4da',
    borderRadius: '4px', padding: '8px 20px', fontSize: '14px',
    fontWeight: '500', cursor: 'pointer',
  },
  error: { color: '#dc3545', fontSize: '13px', marginTop: '8px' },
};

// {{변수명}} 형태의 플레이스홀더를 HTML에서 추출하는 함수
const extractVars = (html) => {
  const matches = html.match(/\{\{(\w+)\}\}/g) || [];
  return [...new Set(matches.map((m) => m.replace(/\{\{|\}\}/g, '')))];
};

export default function TemplateEditor({ template, onSaved, onClose }) {
  const isEdit = Boolean(template);
  const [name, setName] = useState(template?.name || '');
  const [subject, setSubject] = useState(template?.subject || '');
  const [htmlContent, setHtmlContent] = useState(template?.html_content || '');
  const [detectedVars, setDetectedVars] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // html_content 변경 시 변수 목록 자동 갱신
  useEffect(() => {
    const vars = extractVars(htmlContent + ' ' + subject);
    setDetectedVars(vars);
  }, [htmlContent, subject]);

  const handleSave = async () => {
    if (!name.trim()) { setError('템플릿 이름을 입력하세요.'); return; }
    if (!subject.trim()) { setError('제목(Subject)을 입력하세요.'); return; }
    if (!htmlContent.trim()) { setError('HTML 콘텐츠를 입력하세요.'); return; }

    setSaving(true);
    setError('');
    const payload = { name, subject, html_content: htmlContent, variables: detectedVars };

    try {
      if (isEdit) {
        await updateTemplate(template.id, payload);
      } else {
        await createTemplate(payload);
      }
      onSaved();
    } catch (e) {
      setError(e?.response?.data?.error || '저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>{isEdit ? '템플릿 수정' : '새 템플릿 만들기'}</h2>
          <button style={styles.closeBtn} onClick={onClose} title="닫기">x</button>
        </div>

        <div style={styles.body}>
          {/* 템플릿 이름 */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>템플릿 이름</label>
            <input
              style={styles.input}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 신규 회원 환영 이메일"
            />
          </div>

          {/* 제목 (Subject) */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>이메일 제목 (Subject)</label>
            <input
              style={styles.input}
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="예: 안녕하세요 {{name}}님, 특별 혜택을 확인하세요!"
            />
          </div>

          {/* HTML 콘텐츠 */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>HTML 콘텐츠</label>
            <textarea
              style={styles.textarea}
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              placeholder={`<h2>안녕하세요, {{name}}님</h2>\n<p>내용을 입력하세요...</p>`}
              spellCheck={false}
            />
          </div>

          {/* 감지된 변수 목록 */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>감지된 변수 (template variable)</label>
            {detectedVars.length > 0 ? (
              <div style={styles.varList}>
                {detectedVars.map((v) => (
                  <span key={v} style={styles.varBadge}>{`{{${v}}}`}</span>
                ))}
              </div>
            ) : (
              <p style={styles.varHint}>HTML 콘텐츠 또는 제목에 {'{{변수명}}'} 형식으로 변수를 추가하세요.</p>
            )}
          </div>

          {error && <p style={styles.error}>{error}</p>}
        </div>

        <div style={styles.footer}>
          <button style={styles.btnSecondary} onClick={onClose} disabled={saving}>취소</button>
          <button style={styles.btnPrimary} onClick={handleSave} disabled={saving}>
            {saving ? '저장 중...' : isEdit ? '수정 저장' : '템플릿 저장'}
          </button>
        </div>
      </div>
    </div>
  );
}
