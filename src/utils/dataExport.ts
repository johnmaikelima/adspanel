import type { Client } from '../types';

const STORAGE_KEY = 'adspanel_clients';

export const exportDataToJSON = (clients: Client[]) => {
  const dataStr = JSON.stringify(clients, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `adspanel-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importDataFromJSON = (file: File): Promise<Client[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        // Validar estrutura básica
        if (!Array.isArray(data)) {
          throw new Error('Formato de arquivo inválido');
        }
        
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsText(file);
  });
};

export const saveToLocalStorage = (clients: Client[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
};

export const loadFromLocalStorage = (): Client[] | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      return null;
    }
  }
  return null;
};
