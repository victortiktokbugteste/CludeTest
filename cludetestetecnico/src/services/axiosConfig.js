import axios from 'axios';

// Adiciona o token em todas as requisições
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepta erros de autenticação
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Se receber erro 401 (Unauthorized), limpa o token e redireciona para login
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
); 