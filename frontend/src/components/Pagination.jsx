const styles = {
  container: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', justifyContent: 'center' },
  btn: {
    padding: '6px 14px',
    border: '1px solid #dee2e6',
    borderRadius: '4px',
    background: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
  },
  btnDisabled: { opacity: 0.4, cursor: 'not-allowed' },
  info: { fontSize: '14px', color: '#495057' },
};

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div style={styles.container}>
      <button
        style={{ ...styles.btn, ...(page <= 1 ? styles.btnDisabled : {}) }}
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        이전
      </button>
      <span style={styles.info}>
        {page} / {totalPages}
      </span>
      <button
        style={{ ...styles.btn, ...(page >= totalPages ? styles.btnDisabled : {}) }}
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        다음
      </button>
    </div>
  );
}
