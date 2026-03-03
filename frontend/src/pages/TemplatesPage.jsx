import { useState, useEffect, useCallback } from 'react';
import { getTemplates, deleteTemplate } from '../api/templateApi';
import TemplateEditor from '../components/TemplateEditor';
import TemplatePreview from '../components/TemplatePreview';

const styles = {
  page: { padding: '24px', maxWidth: '1100px', margin: '0 auto' },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: '24px',
  },
  title: { margin: 0, fontSize: '22px', fontWeight: '700', color: '#212529' },
  newBtn: {
    background: '#0d6efd', color: '#fff', border: 'none', borderRadius: '6px',
    padding: '9px 18px', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '16px',
  },
  card: {
    background: '#fff', border: '1px solid #dee2e6', borderRadius: '8px',
    padding: '18px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    display: 'flex', flexDirection: 'column', gap: '8px',
  },
  cardName: { margin: 0, fontSize: '16px', fontWeight: '700', color: '#212529' },
  cardSubject: { margin: 0, fontSize: '13px', color: '#6c757d', lineHeight: '1.4' },
  cardMeta: { fontSize: '12px', color: '#adb5bd' },
  varList: { display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '2px' },
  varBadge: {
    background: '#e7f3ff', color: '#0052cc', borderRadius: '10px',
    padding: '1px 8px', fontSize: '11px', fontWeight: '500',
  },
  cardActions: {
    display: 'flex', gap: '6px', marginTop: '10px', paddingTop: '10px',
    borderTop: '1px solid #f0f0f0',
  },
  btnPreview: {
    background: '#e9ecef', color: '#495057', border: 'none', borderRadius: '4px',
    padding: '6px 12px', fontSize: '12px', fontWeight: '500', cursor: 'pointer',
  },
  btnEdit: {
    background: '#0d6efd', color: '#fff', border: 'none', borderRadius: '4px',
    padding: '6px 12px', fontSize: '12px', fontWeight: '500', cursor: 'pointer',
  },
  btnDelete: {
    background: '#fff', color: '#dc3545', border: '1px solid #dc3545',
    borderRadius: '4px', padding: '6px 12px', fontSize: '12px',
    fontWeight: '500', cursor: 'pointer', marginLeft: 'auto',
  },
  empty: {
    textAlign: 'center', padding: '60px 20px', background: '#fff',
    border: '2px dashed #dee2e6', borderRadius: '8px', color: '#6c757d',
  },
  emptyTitle: { fontSize: '16px', fontWeight: '600', marginBottom: '8px' },
  loading: { textAlign: 'center', padding: '40px', color: '#6c757d' },
  error: { color: '#dc3545', padding: '16px', textAlign: 'center' },
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getTemplates();
      setTemplates(res.data);
    } catch {
      setError('템플릿 목록을 불러오지 못했습니다. 백엔드 서버가 실행 중인지 확인하세요.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);

  const handleNew = () => {
    setEditingTemplate(null);
    setShowEditor(true);
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setShowEditor(true);
  };

  const handleSaved = () => {
    setShowEditor(false);
    setEditingTemplate(null);
    fetchTemplates();
  };

  const handleEditorClose = () => {
    setShowEditor(false);
    setEditingTemplate(null);
  };

  const handleDelete = async (template) => {
    if (!window.confirm(`"${template.name}" 템플릿을 삭제하시겠습니까?`)) return;
    try {
      await deleteTemplate(template.id);
      fetchTemplates();
    } catch {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const getVars = (template) => {
    try { return JSON.parse(template.variables || '[]'); } catch { return []; }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>템플릿 관리</h1>
        <button style={styles.newBtn} onClick={handleNew}>+ 새 템플릿</button>
      </div>

      {loading && <p style={styles.loading}>불러오는 중...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && !error && templates.length === 0 && (
        <div style={styles.empty}>
          <p style={styles.emptyTitle}>등록된 템플릿이 없습니다</p>
          <p style={{ fontSize: '14px' }}>"새 템플릿" 버튼으로 첫 번째 이메일 템플릿을 만들어보세요.</p>
        </div>
      )}

      {!loading && templates.length > 0 && (
        <div style={styles.grid}>
          {templates.map((t) => {
            const vars = getVars(t);
            return (
              <div key={t.id} style={styles.card}>
                <h3 style={styles.cardName}>{t.name}</h3>
                <p style={styles.cardSubject}>{t.subject}</p>

                {vars.length > 0 && (
                  <div style={styles.varList}>
                    {vars.map((v) => (
                      <span key={v} style={styles.varBadge}>{`{{${v}}}`}</span>
                    ))}
                  </div>
                )}

                <p style={styles.cardMeta}>
                  수정일: {formatDate(t.updated_at || t.created_at)}
                </p>

                <div style={styles.cardActions}>
                  <button style={styles.btnPreview} onClick={() => setPreviewTemplate(t)}>
                    미리보기
                  </button>
                  <button style={styles.btnEdit} onClick={() => handleEdit(t)}>
                    수정
                  </button>
                  <button style={styles.btnDelete} onClick={() => handleDelete(t)}>
                    삭제
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showEditor && (
        <TemplateEditor
          template={editingTemplate}
          onSaved={handleSaved}
          onClose={handleEditorClose}
        />
      )}

      {previewTemplate && (
        <TemplatePreview
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
        />
      )}
    </div>
  );
}
