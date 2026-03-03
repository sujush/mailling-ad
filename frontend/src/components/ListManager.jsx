import { useState } from 'react';

const styles = {
  container: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
  sidebar: { width: '280px', flexShrink: 0 },
  main: { flex: 1, minWidth: '300px' },
  card: {
    border: '1px solid #dee2e6',
    borderRadius: '6px',
    padding: '16px',
    marginBottom: '10px',
    cursor: 'pointer',
    background: '#fff',
    transition: 'background 0.15s',
  },
  cardSelected: { background: '#e7f1ff', borderColor: '#0d6efd' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' },
  cardTitle: { fontWeight: '600', fontSize: '15px', margin: 0 },
  cardDesc: { fontSize: '13px', color: '#6c757d', margin: 0 },
  cardCount: { fontSize: '12px', color: '#495057', marginTop: '4px' },
  btnDelete: {
    padding: '2px 8px',
    fontSize: '12px',
    background: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  addForm: {
    background: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: '6px',
    padding: '14px',
    marginBottom: '14px',
  },
  input: {
    width: '100%',
    padding: '7px 10px',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    fontSize: '14px',
    marginBottom: '8px',
    boxSizing: 'border-box',
  },
  btnPrimary: {
    padding: '7px 16px',
    background: '#0d6efd',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  sectionTitle: { fontWeight: '600', fontSize: '16px', marginBottom: '12px', color: '#343a40' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  th: {
    background: '#f8f9fa',
    padding: '9px 12px',
    textAlign: 'left',
    borderBottom: '2px solid #dee2e6',
    fontWeight: '600',
    color: '#495057',
  },
  td: { padding: '9px 12px', borderBottom: '1px solid #dee2e6' },
  placeholder: { color: '#6c757d', textAlign: 'center', padding: '30px' },
  badge: {
    display: 'inline-block',
    padding: '2px 7px',
    borderRadius: '10px',
    fontSize: '11px',
    fontWeight: '500',
  },
  badgeActive: { background: '#d1e7dd', color: '#0a3622' },
  badgeInactive: { background: '#f8d7da', color: '#58151c' },
};

export default function ListManager({
  lists,
  selectedList,
  listRecipients,
  listRecipientsLoading,
  onSelectList,
  onAddList,
  onDeleteList,
}) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAddList = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await onAddList({ name: name.trim(), description: description.trim() });
      setName('');
      setDescription('');
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteList = (e, list) => {
    e.stopPropagation();
    if (window.confirm(`"${list.name}" 리스트를 삭제하시겠습니까?`)) {
      onDeleteList(list.id);
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar: List panel */}
      <div style={styles.sidebar}>
        <div style={styles.sectionTitle}>리스트 목록</div>

        {!showForm && (
          <button style={{ ...styles.btnPrimary, marginBottom: '12px', width: '100%' }} onClick={() => setShowForm(true)}>
            + 새 리스트 추가
          </button>
        )}

        {showForm && (
          <form onSubmit={handleAddList} style={styles.addForm}>
            <input
              style={styles.input}
              type="text"
              placeholder="리스트 이름 *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            <input
              style={styles.input}
              type="text"
              placeholder="설명 (선택)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" style={styles.btnPrimary} disabled={submitting || !name.trim()}>
                {submitting ? '생성 중...' : '생성'}
              </button>
              <button
                type="button"
                style={{ ...styles.btnPrimary, background: '#6c757d' }}
                onClick={() => { setShowForm(false); setName(''); setDescription(''); }}
              >
                취소
              </button>
            </div>
          </form>
        )}

        {lists.length === 0 ? (
          <p style={styles.placeholder}>리스트가 없습니다.</p>
        ) : (
          lists.map((list) => (
            <div
              key={list.id}
              style={{
                ...styles.card,
                ...(selectedList?.id === list.id ? styles.cardSelected : {}),
              }}
              onClick={() => onSelectList(selectedList?.id === list.id ? null : list)}
            >
              <div style={styles.cardHeader}>
                <p style={styles.cardTitle}>{list.name}</p>
                <button style={styles.btnDelete} onClick={(e) => handleDeleteList(e, list)}>
                  삭제
                </button>
              </div>
              {list.description && <p style={styles.cardDesc}>{list.description}</p>}
              <p style={styles.cardCount}>
                수신자 수: {list.recipientCount ?? list.recipient_count ?? 0}명
              </p>
            </div>
          ))
        )}
      </div>

      {/* Main: Recipients of selected list */}
      <div style={styles.main}>
        {selectedList ? (
          <>
            <div style={styles.sectionTitle}>
              "{selectedList.name}" 리스트 수신자
            </div>
            {listRecipientsLoading ? (
              <p style={styles.placeholder}>로딩 중...</p>
            ) : listRecipients.length === 0 ? (
              <p style={styles.placeholder}>이 리스트에 수신자가 없습니다.</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>이름</th>
                    <th style={styles.th}>이메일</th>
                    <th style={styles.th}>구독 상태</th>
                  </tr>
                </thead>
                <tbody>
                  {listRecipients.map((r) => (
                    <tr key={r.id}>
                      <td style={styles.td}>{r.name || '-'}</td>
                      <td style={styles.td}>{r.email}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, ...(r.subscribed ? styles.badgeActive : styles.badgeInactive) }}>
                          {r.subscribed ? '구독 중' : '수신거부'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        ) : (
          <p style={styles.placeholder}>리스트를 선택하면 수신자 목록이 표시됩니다.</p>
        )}
      </div>
    </div>
  );
}
