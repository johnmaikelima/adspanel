// Configuração da URL da API
// Detecta automaticamente se está em produção ou desenvolvimento

const getApiUrl = () => {
  // Se estiver definida a variável de ambiente, usa ela
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Se estiver em localhost, usa a API local
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3001/api';
  }
  
  // Em produção, usa a mesma URL do frontend mas com /api
  // Exemplo: se o frontend está em https://adspanel.com, a API será https://adspanel.com/api
  return `${window.location.origin}/api`;
};

export const API_URL = getApiUrl();
export const API_CLIENTS_URL = `${API_URL}/clients`;
