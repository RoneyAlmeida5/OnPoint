import axios from "axios";

// Criar a instância do Axios
const api = axios.create({
  baseURL: "http://localhost:3000", // Ajuste conforme necessário
});

// Interceptor para adicionar o token automaticamente em cada requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Obtém o token salvo
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
