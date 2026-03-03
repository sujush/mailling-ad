import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getRecipients,
  createRecipient,
  updateRecipient,
  deleteRecipient,
  unsubscribeRecipient,
} from '../api/recipientApi';

// Mock data for when backend is unavailable
const MOCK_RECIPIENTS = [
  { id: 1, name: '김철수', email: 'kim@example.com', tags: 'VIP', subscribed: true, createdAt: '2026-01-01' },
  { id: 2, name: '이영희', email: 'lee@example.com', tags: '신규', subscribed: true, createdAt: '2026-01-15' },
  { id: 3, name: '박민준', email: 'park@example.com', tags: '', subscribed: false, createdAt: '2026-02-01' },
  { id: 4, name: '최지수', email: 'choi@example.com', tags: 'VIP,단골', subscribed: true, createdAt: '2026-02-10' },
  { id: 5, name: '정하늘', email: 'jung@example.com', tags: '신규', subscribed: true, createdAt: '2026-02-20' },
];

export function useRecipients() {
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [useMock, setUseMock] = useState(false);

  const debounceRef = useRef(null);

  const fetchRecipients = useCallback(async (currentPage, currentSearch) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getRecipients(currentPage, 20, currentSearch);
      const data = res.data;
      setRecipients(data.recipients || data.data || []);
      setTotalPages(data.totalPages || Math.ceil((data.total || 0) / 20) || 1);
      setUseMock(false);
    } catch (err) {
      // Fall back to mock data when backend is unavailable
      console.warn('Backend unavailable, using mock data:', err.message);
      setUseMock(true);
      const filtered = currentSearch
        ? MOCK_RECIPIENTS.filter(
            (r) =>
              r.name.includes(currentSearch) || r.email.includes(currentSearch)
          )
        : MOCK_RECIPIENTS;
      setRecipients(filtered);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetchRecipients(1, search);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [search, fetchRecipients]);

  useEffect(() => {
    fetchRecipients(page, search);
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const addRecipient = useCallback(async (data) => {
    if (useMock) {
      const newRecipient = {
        id: Date.now(),
        name: data.name || '',
        email: data.email,
        tags: data.tags || '',
        subscribed: true,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setRecipients((prev) => [newRecipient, ...prev]);
      return newRecipient;
    }
    const res = await createRecipient(data);
    await fetchRecipients(page, search);
    return res.data;
  }, [useMock, page, search, fetchRecipients]);

  const editRecipient = useCallback(async (id, data) => {
    if (useMock) {
      setRecipients((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...data } : r))
      );
      return;
    }
    await updateRecipient(id, data);
    await fetchRecipients(page, search);
  }, [useMock, page, search, fetchRecipients]);

  const removeRecipient = useCallback(async (id) => {
    // Optimistic update
    setRecipients((prev) => prev.filter((r) => r.id !== id));
    if (!useMock) {
      try {
        await deleteRecipient(id);
      } catch (err) {
        setError('삭제 실패: ' + err.message);
        fetchRecipients(page, search);
      }
    }
  }, [useMock, page, search, fetchRecipients]);

  const toggleUnsubscribe = useCallback(async (id) => {
    if (useMock) {
      setRecipients((prev) =>
        prev.map((r) => (r.id === id ? { ...r, subscribed: !r.subscribed } : r))
      );
      return;
    }
    // Optimistic update
    setRecipients((prev) =>
      prev.map((r) => (r.id === id ? { ...r, subscribed: !r.subscribed } : r))
    );
    try {
      await unsubscribeRecipient(id);
    } catch (err) {
      setError('수신거부 처리 실패: ' + err.message);
      fetchRecipients(page, search);
    }
  }, [useMock, page, search, fetchRecipients]);

  return {
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
    refresh: () => fetchRecipients(page, search),
  };
}
