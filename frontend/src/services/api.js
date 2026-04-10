import axios from 'axios';

// Instance Axios configurée avec l'URL de base du backend
const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export default api;