import axios from 'axios';

const API_URL = 'http://localhost:5000/api/visits';

export const getVisits = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getVisitsStats = async () => {
  const response = await axios.get(`${API_URL}/stats`);
  return response.data;
};

export const createVisit = async (visitData) => {
  const response = await axios.post(API_URL, visitData);
  return response.data;
};

export const updateVisit = async (id, visitData) => {
  const response = await axios.put(`${API_URL}/${id}`, visitData);
  return response.data;
};

export const updateVisitStatus = async (id, status) => {
  const response = await axios.patch(`${API_URL}/${id}/status`, { status });
  return response.data;
};

export const deleteVisit = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
