import { useState, useEffect, useCallback } from 'react';
import {
  getLists,
  createList,
  deleteList,
  addToList,
  getListRecipients,
} from '../api/recipientApi';

const MOCK_LISTS = [
  { id: 1, name: 'VIP 고객', description: 'VIP 등급 고객 리스트', recipientCount: 2 },
  { id: 2, name: '신규 가입자', description: '최근 30일 내 가입자', recipientCount: 2 },
  { id: 3, name: '전체 구독자', description: '전체 구독 수신자', recipientCount: 4 },
];

const MOCK_LIST_RECIPIENTS = {
  1: [
    { id: 1, name: '김철수', email: 'kim@example.com', subscribed: true },
    { id: 4, name: '최지수', email: 'choi@example.com', subscribed: true },
  ],
  2: [
    { id: 2, name: '이영희', email: 'lee@example.com', subscribed: true },
    { id: 5, name: '정하늘', email: 'jung@example.com', subscribed: true },
  ],
  3: [
    { id: 1, name: '김철수', email: 'kim@example.com', subscribed: true },
    { id: 2, name: '이영희', email: 'lee@example.com', subscribed: true },
    { id: 4, name: '최지수', email: 'choi@example.com', subscribed: true },
    { id: 5, name: '정하늘', email: 'jung@example.com', subscribed: true },
  ],
};

export function useLists() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useMock, setUseMock] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [listRecipients, setListRecipients] = useState([]);
  const [listRecipientsLoading, setListRecipientsLoading] = useState(false);

  const fetchLists = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getLists();
      setLists(res.data.lists || res.data || []);
      setUseMock(false);
    } catch (err) {
      console.warn('Backend unavailable, using mock lists:', err.message);
      setUseMock(true);
      setLists(MOCK_LISTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const fetchListRecipients = useCallback(async (listId) => {
    setListRecipientsLoading(true);
    try {
      if (useMock) {
        setListRecipients(MOCK_LIST_RECIPIENTS[listId] || []);
      } else {
        const res = await getListRecipients(listId);
        setListRecipients(res.data.recipients || res.data || []);
      }
    } catch (err) {
      console.warn('Failed to fetch list recipients:', err.message);
      setListRecipients(MOCK_LIST_RECIPIENTS[listId] || []);
    } finally {
      setListRecipientsLoading(false);
    }
  }, [useMock]);

  const selectList = useCallback((list) => {
    setSelectedList(list);
    if (list) fetchListRecipients(list.id);
    else setListRecipients([]);
  }, [fetchListRecipients]);

  const addList = useCallback(async (data) => {
    if (useMock) {
      const newList = {
        id: Date.now(),
        name: data.name,
        description: data.description || '',
        recipientCount: 0,
      };
      setLists((prev) => [...prev, newList]);
      return newList;
    }
    const res = await createList(data);
    await fetchLists();
    return res.data;
  }, [useMock, fetchLists]);

  const removeList = useCallback(async (id) => {
    // Optimistic update
    setLists((prev) => prev.filter((l) => l.id !== id));
    if (selectedList?.id === id) {
      setSelectedList(null);
      setListRecipients([]);
    }
    if (!useMock) {
      try {
        await deleteList(id);
      } catch (err) {
        setError('리스트 삭제 실패: ' + err.message);
        fetchLists();
      }
    }
  }, [useMock, selectedList, fetchLists]);

  const assignToList = useCallback(async (listId, recipientId) => {
    if (useMock) {
      setError(null);
      return;
    }
    try {
      await addToList(listId, recipientId);
      if (selectedList?.id === listId) {
        await fetchListRecipients(listId);
      }
    } catch (err) {
      setError('리스트 추가 실패: ' + err.message);
    }
  }, [useMock, selectedList, fetchListRecipients]);

  return {
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
    assignToList,
    refresh: fetchLists,
  };
}
