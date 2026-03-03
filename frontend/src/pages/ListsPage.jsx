import { useLists } from '../hooks/useLists';
import ListManager from '../components/ListManager';

const styles = {
  page: { padding: '24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { margin: 0, fontSize: '22px', fontWeight: '700', color: '#212529' },
  mockBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    background: '#fff3cd',
    border: '1px solid #ffc107',
    borderRadius: '4px',
    fontSize: '12px',
    color: '#856404',
  },
  errorBox: {
    background: '#f8d7da',
    border: '1px solid #f5c2c7',
    borderRadius: '4px',
    padding: '10px 14px',
    color: '#842029',
    marginBottom: '12px',
    fontSize: '14px',
  },
  loadingText: { textAlign: 'center', padding: '40px', color: '#6c757d' },
};

export default function ListsPage() {
  const {
    lists,
    loading,
    error,
    useMock,
    selectedList,
    listRecipients,
    listRecipientsLoading,
    selectList,
    addList,
    removeList,
  } = useLists();

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>리스트 관리</h1>
        {useMock && (
          <span style={styles.mockBadge}>Mock 데이터 사용 중 (백엔드 미연결)</span>
        )}
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      {loading ? (
        <p style={styles.loadingText}>로딩 중...</p>
      ) : (
        <ListManager
          lists={lists}
          selectedList={selectedList}
          listRecipients={listRecipients}
          listRecipientsLoading={listRecipientsLoading}
          onSelectList={selectList}
          onAddList={addList}
          onDeleteList={removeList}
        />
      )}
    </div>
  );
}
