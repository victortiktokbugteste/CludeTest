import axios from 'axios';

const API_URL = "https://localhost:7068";

export async function getPacientes() {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/get-todos-pacientes`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
}

export async function deletePaciente(id) {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${API_URL}/delete-paciente/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.status === 204;
} 