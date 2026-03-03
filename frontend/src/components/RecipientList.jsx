import { useState } from 'react';
import RecipientForm from './RecipientForm';

const styles = {
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  th: {
    background: '#f8f9fa',
    padding: '10px 12px',
    textAlign: 'left',
    borderBottom: '2px solid #dee2e6',
    fontWeight: '600',
    color: '#495057',
    whiteSpace: 'nowrap',
  },
  td: { padding: '10px 12px', borderBottom: '1px solid #dee2e6', verticalAlign: 'middle' },
  badge: {
    display: 'inline-block',
    padding: '2px 7px',
    borderRadius: '10px',
    fontSize: '11px',
    fontWeight: '500',
    marginRight: '4px',
  },
  badgeActive: { background: '#d1e7dd', color: '#0a3622' },
  badgeInactive: { background: '#f8d7da', color: '#58151c' },
  tag: {
    display: 'inline-block',
    padding: '2px 7px',
    borderRadius: '10px',
    fontSize: '11px',
    background: '#e9ecef',
    color: '#495057',
    marginRight: '3px',
  },
  btnSmall: {
    padding: '4px 10px',
    fontSize: '12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '4px',
  },
  btnEdit: { background: '#0d6efd', color: '#fff' },
  btnDelete: { background: '#dc3545', color: '#fff' },
  btnUnsub: { background: '#fd7e14', color: '#fff' },
  btnResub: { background: '#198754', color: '#fff' },
  emptyRow: { textAlign: 'center', padding: '40px', color: '#6c757d' },
};

export default function RecipientList({ recipients, onEdit, onDelete, onToggleSubscribe }) {
  const [editingId, setEditingId] = useState(null);

  const handleEditSubmit = async (data) => {
    const recipient = recipients.find((r) => r.id === editingId);
    await onEdit(editingId, { ...data, email: recipient.email });
    setEditingId(null);
  };

  const handleDelete = (recipient) => {
    if (window.confirm(`"${recipient.email}" 수신자를 삭제하시겠습니까?`)) {
      onDelete(recipient.id);
    }
  };

  if (recipients.length === 0) {
    return (
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>이름</th>
            <th style={styles.th}>이메일</th>
            <th style={styles.th}>태그</th>
            <th style={styles.th}>구독 상태</th>
            <th style={styles.th}>작업</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={5} style={styles.emptyRow}>
              수신자가 없습니다.
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>이름</th>
          <th style={styles.th}>이메일</th>
          <th style={styles.th}>태그</th>
          <th style={styles.th}>구독 상태</th>
          <th style={styles.th}>작업</th>
        </tr>
      </thead>
      <tbody>
        {recipients.map((r) =>
          editingId === r.id ? (
            <tr key={r.id}>
              <td colSpan={5} style={styles.td}>
                <RecipientForm
                  initialData={r}
                  onSubmit={handleEditSubmit}
                  onCancel={() => setEditingId(null)}
                />
              </td>
            </tr>
          ) : (
            <tr key={r.id}>
              <td style={styles.td}>{r.name || '-'}</td>
              <td style={styles.td}>{r.email}</td>
              <td style={styles.td}>
                {r.tags
                  ? r.tags
                      .split(',')
                      .map((t) => t.trim())
                      .filter(Boolean)
                      .map((t) => (
                        <span key={t} style={styles.tag}>
                          {t}
                        </span>
                      ))
                  : '-'}
              </td>
              <td style={styles.td}>
                <span style={{ ...styles.badge, ...(r.subscribed ? styles.badgeActive : styles.badgeInactive) }}>
                  {r.subscribed ? '구독 중' : '수신거부'}
                </span>
              </td>
              <td style={styles.td}>
                <button
                  style={{ ...styles.btnSmall, ...styles.btnEdit }}
                  onClick={() => setEditingId(r.id)}
                >
                  수정
                </button>
                <button
                  style={{ ...styles.btnSmall, ...styles.btnDelete }}
                  onClick={() => handleDelete(r)}
                >
                  삭제
                </button>
                <button
                  style={{
                    ...styles.btnSmall,
                    ...(r.subscribed ? styles.btnUnsub : styles.btnResub),
                  }}
                  onClick={() => onToggleSubscribe(r.id)}
                >
                  {r.subscribed ? '수신거부' : '재구독'}
                </button>
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
}
