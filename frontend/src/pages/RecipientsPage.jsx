import { useRecipients } from '../hooks/useRecipients';
import RecipientList from '../components/RecipientList';
import RecipientForm from '../components/RecipientForm';
import Pagination from '../components/Pagination';

const styles = {
  page: { padding: '24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { margin: 0, fontSize: '22px', fontWeight: '700', color: '#212529' },
  searchBar: {
    padding: '8px 14px',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    fontSize: '14px',
    width: '260px',
    outline: 'none',
  },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', gap: '12px' },
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
  tableWrapper: { overflowX: 'auto', border: '1px solid #dee2e6', borderRadius: '6px' },
  countText: { fontSize: '13px', color: '#6c757d' },
  btnToggleForm: {
    padding: '8px 16px',
    background: '#0d6efd',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
};

export default function RecipientsPage() {
  const {
    recipients,
    loading,
    error,
    page,
    totalPages,
    search,
    useMock,
    setSearch,
    setPage,
    addRecipient,
    editRecipient,
    removeRecipient,
    toggleUnsubscribe,
  } = useRecipients();

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>수신자 관리</h1>
        {useMock && (
          <span style={styles.mockBadge}>Mock 데이터 사용 중 (백엔드 미연결)</span>
        )}
      </div>

      {/* Add recipient form */}
      <RecipientForm onSubmit={addRecipient} />

      {/* Search + status bar */}
      <div style={styles.toolbar}>
        <input
          style={styles.searchBar}
          type="text"
          placeholder="이름 또는 이메일 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span style={styles.countText}>
          총 {recipients.length}명 표시 중
        </span>
      </div>

      {/* Error message */}
      {error && <div style={styles.errorBox}>{error}</div>}

      {/* Table */}
      {loading ? (
        <p style={styles.loadingText}>로딩 중...</p>
      ) : (
        <div style={styles.tableWrapper}>
          <RecipientList
            recipients={recipients}
            onEdit={editRecipient}
            onDelete={removeRecipient}
            onToggleSubscribe={toggleUnsubscribe}
          />
        </div>
      )}

      {/* Pagination */}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
