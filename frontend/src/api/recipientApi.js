import axios from 'axios';

const BASE = 'http://localhost:3001/api';

export const getRecipients = (page = 1, limit = 20, search = '') =>
  axios.get(`${BASE}/recipients`, { params: { page, limit, search } });

export const createRecipient = (data) =>
  axios.post(`${BASE}/recipients`, data);

export const updateRecipient = (id, data) =>
  axios.put(`${BASE}/recipients/${id}`, data);

export const deleteRecipient = (id) =>
  axios.delete(`${BASE}/recipients/${id}`);

export const unsubscribeRecipient = (id) =>
  axios.post(`${BASE}/recipients/${id}/unsubscribe`);

export const getLists = () =>
  axios.get(`${BASE}/lists`);

export const createList = (data) =>
  axios.post(`${BASE}/lists`, data);

export const deleteList = (id) =>
  axios.delete(`${BASE}/lists/${id}`);

export const addToList = (listId, recipientId) =>
  axios.post(`${BASE}/lists/${listId}/add-recipient`, { recipientId });

export const getListRecipients = (listId) =>
  axios.get(`${BASE}/lists/${listId}/recipients`);
