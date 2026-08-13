import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

export interface JunctionData {
  id: string;
  name: string;
  zone: string;
  lat: number;
  lng: number;
  road_class: string;
  score: number;
  coverage_status: string;
}

export const fetchJunctions = async (): Promise<JunctionData[]> => {
  const response = await axios.get(`${API_BASE}/junctions`);
  return response.data;
};

export const fetchJunctionExplain = async (id: string) => {
  const response = await axios.get(`${API_BASE}/junctions/${id}/explain`);
  return response.data;
};

export const injectIncident = async (junctionId: string, type: string, severity: number) => {
  const response = await axios.post(`${API_BASE}/incidents`, {
    junction_id: junctionId,
    type,
    severity
  });
  return response.data;
};
