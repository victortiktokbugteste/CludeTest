import axios from 'axios';

const API_URL = "http://localhost:5000";

export async function getAgendamentos() {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/get-todos-agendamentos`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
}

export async function deleteAgendamento(id) {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${API_URL}/delete-agendamento/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.status === 204;
} 