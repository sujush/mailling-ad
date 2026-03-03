import axios from 'axios';

const BASE = 'http://localhost:3001/api/templates';

export const getTemplates = () => axios.get(BASE);
export const getTemplate = (id) => axios.get(`${BASE}/${id}`);
export const createTemplate = (data) => axios.post(BASE, data);
export const updateTemplate = (id, data) => axios.put(`${BASE}/${id}`, data);
export const deleteTemplate = (id) => axios.delete(`${BASE}/${id}`);
export const previewTemplate = (id, variables) =>
  axios.post(`${BASE}/${id}/preview`, { variables });
