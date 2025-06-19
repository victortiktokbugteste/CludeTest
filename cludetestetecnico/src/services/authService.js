import axios from 'axios';

const API_URL = "http://localhost:5000/api/Auth";

export async function login(username, password) {
  const response = await axios.post(`${API_URL}/login`, {
    username,
    password
  });

  if (response.data.token) {
    // Store token with expiration time (15 minutes)
    const expirationTime = new Date().getTime() + 15 * 60 * 1000;
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("tokenExpiration", expirationTime.toString());
  }

  return response.data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("tokenExpiration");
}

export function isAuthenticated() {
  const token = localStorage.getItem("token");
  const expirationTime = localStorage.getItem("tokenExpiration");
  
  if (!token || !expirationTime) {
    return false;
  }

  // Check if token is expired
  if (new Date().getTime() > parseInt(expirationTime)) {
    logout();
    return false;
  }

  return true;
}
