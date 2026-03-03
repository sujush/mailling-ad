import { useState, useEffect } from 'react';
import { previewTemplate } from '../api/templateApi';

const styles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1100, padding: '16px',
  },
  modal: {
    background: '#fff', borderRadius: '8px', width: '100%', maxWidth: '900px',
    maxHeight: '92vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 20px', borderBottom: '1px solid #dee2e6', flexShrink: 0,
  },
  title: { margin: 0, fontSize: '16px', fontWeight: '700', color: '#212529' },
  closeBtn: {
    background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer',
    color: '#6c757d', lineHeight: 1, padding: '0 4px',
  },
  body: { display: 'flex', overflow: 'hidden', flex: 1 },
  sidebar: {
    width: '240px', flexShrink: 0, borderRight: '1px solid #dee2e6',
    padding: '16px', overflowY: 'auto', background: '#f8f9fa',
  },
  sidebarTitle: { fontSize: '13px', fontWeight: '700', color: '#495057', marginBottom: '12px' },
  varGroup: { marginBottom: '12px' },
  varLabel: {
    display: 'block', fontSize: '12px', fontWeight: '600',
    color: '#0052cc', marginBottom: '4px',
  },
  varInput: {
    width: '100%', padding: '6px 8px', border: '1px solid #ced4da',
    borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box', fontFamily: 'inherit',
  },
  previewBtn: {
    width: '100%', background: '#0d6efd', color: '#fff', border: 'none',
    borderRadius: '4px', padding: '9px 0', fontSize: '13px',
    fontWeight: '600', cursor: 'pointer', marginTop: '4px',
  },
  previewArea: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  subjectBar: {
    padding: '10px 16px', borderBottom: '1px solid #dee2e6',
    fontSize: '13px', color: '#495057', background: '#fff', flexShrink: 0,
  },
  subjectLabel: { fontWeight: '700', marginRight: '6px', color: '#212529' },
  iframe: { flex: 1, width: '100%', border: 'none', background: '#fff' },
  emptyState: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#adb5bd', fontSize: '14px', flexDirection: 'column', gap: '8px',
  },
  noVarHint: { fontSize: '12px', color: '#6c757d', marginTop: '8px' },
  error: { color: '#dc3545', fontSize: '12px', marginTop: '8px' },
};

export default function TemplatePreview({ template, onClose }) {
  const [varValues, setVarValues] = useState({});
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewSubject, setPreviewSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  const variables = (() => {
    try { return JSON.parse(template.variables || '[]'); } catch { return []; }
  })();

  // 초기 로드 시 기본 미리보기 표시
  useEffect(() => {
    handlePreview();
  }, []);

  const handlePreview = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await previewTemplate(template.id, varValues);
      setPreviewHtml(res.data.html);
      setPreviewSubject(res.data.subject);
      setLoaded(true);
    } catch (e) {
      setError(e?.response?.data?.error || '미리보기 로드 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleVarChange = (varName, value) => {
    setVarValues((prev) => ({ ...prev, [varName]: value }));
  };

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>미리보기 — {template.name}</h2>
          <button style={styles.closeBtn} onClick={onClose} title="닫기">x</button>
        </div>

        <div style={styles.body}>
          {/* 사이드바: 변수 테스트 입력 폼 */}
          <div style={styles.sidebar}>
            <p style={styles.sidebarTitle}>변수 테스트 입력</p>
            {variables.length > 0 ? (
              variables.map((v) => (
                <div key={v} style={styles.varGroup}>
                  <label style={styles.varLabel}>{`{{${v}}}`}</label>
                  <input
                    style={styles.varInput}
                    type="text"
                    value={varValues[v] || ''}
                    onChange={(e) => handleVarChange(v, e.target.value)}
                    placeholder={`${v} 값 입력`}
                  />
                </div>
              ))
            ) : (
              <p style={styles.noVarHint}>이 템플릿에는 변수가 없습니다.</p>
            )}

            <button
              style={styles.previewBtn}
              onClick={handlePreview}
              disabled={loading}
            >
              {loading ? '로딩 중...' : '미리보기 갱신'}
            </button>

            {error && <p style={styles.error}>{error}</p>}
          </div>

          {/* 미리보기 영역: iframe srcdoc */}
          <div style={styles.previewArea}>
            {loaded ? (
              <>
                <div style={styles.subjectBar}>
                  <span style={styles.subjectLabel}>제목:</span>
                  {previewSubject}
                </div>
                <iframe
                  style={styles.iframe}
                  srcDoc={previewHtml}
                  title="이메일 미리보기"
                  sandbox="allow-same-origin"
                />
              </>
            ) : (
              <div style={styles.emptyState}>
                <span>미리보기 로딩 중...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
