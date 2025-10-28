import { useState, useEffect } from 'react';
import type { Client, MonthlyData, OrganicTrafficData, SavedReport, ClientControl } from '../types';
import { API_CLIENTS_URL } from '../config';

const STORAGE_KEY = 'adspanel_clients';
const API_URL = API_CLIENTS_URL;

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const importClients = (importedClients: Client[]) => {
    setClients(importedClients);
  };

  // Carregar dados da API (com fallback para localStorage)
  useEffect(() => {
    const loadClients = async () => {
      try {
        // Pegar token de autenticação
        const token = localStorage.getItem('auth_token');
        const headers: HeadersInit = {
          'Content-Type': 'application/json'
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Tentar carregar da API
        const response = await fetch(API_URL, { headers });
        if (response.ok) {
          const apiClients = await response.json();
          
          // Se a API está vazia, migrar do localStorage
          if (apiClients.length === 0) {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
              console.log('🔄 Migrando dados do localStorage para o arquivo...');
              const parsedClients = JSON.parse(stored);
              
              // Migração: adicionar organicData se não existir e migrar dados antigos
              const migratedClients = parsedClients.map((client: any) => ({
                ...client,
                monthlyData: (client.monthlyData || []).map((data: any) => ({
                  ...data,
                  month: data.endDate.slice(0, 7)
                })),
                organicData: (client.organicData || []).map((data: any) => ({
                  ...data,
                  month: data.endDate.slice(0, 7),
                  impressions: data.impressions !== undefined ? data.impressions : (data.sessions || 0),
                  clicks: data.clicks || 0,
                  averagePosition: data.averagePosition !== undefined ? data.averagePosition : 0
                })),
                savedReports: client.savedReports || [],
                control: client.control || undefined
              }));
              
              // Salvar dados migrados na API
              await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(migratedClients)
              });
              
              setClients(migratedClients);
              console.log('✅ Migração concluída! Dados salvos em data.json');
              return;
            }
          }
          
          // Usar dados da API
          setClients(apiClients);
        } else {
          throw new Error('API não disponível');
        }
      } catch (error) {
        console.warn('⚠️ Servidor backend não está rodando. Usando localStorage...');
        // Fallback para localStorage se a API não estiver disponível
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsedClients = JSON.parse(stored);
          setClients(parsedClients);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadClients();
  }, []);

  // Salvar na API e localStorage sempre que houver mudanças
  useEffect(() => {
    if (clients.length > 0 && !isLoading) {
      // Pegar token de autenticação
      const token = localStorage.getItem('auth_token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Salvar na API
      fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(clients)
      }).catch(error => {
        console.warn('⚠️ Erro ao salvar na API, usando apenas localStorage:', error);
      });
      
      // Backup no localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
    }
  }, [clients, isLoading]);

  const addClient = (client: Omit<Client, 'id' | 'createdAt' | 'monthlyData' | 'organicData'>) => {
    const newClient: Client = {
      ...client,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      monthlyData: [],
      organicData: [],
    };
    setClients(prev => [...prev, newClient]);
    return newClient;
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev =>
      prev.map(client => (client.id === id ? { ...client, ...updates } : client))
    );
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(client => client.id !== id));
  };

  const addMonthlyData = (clientId: string, data: Omit<MonthlyData, 'id'>) => {
    setClients(prev =>
      prev.map(client => {
        if (client.id === clientId) {
          const newData: MonthlyData = {
            ...data,
            id: crypto.randomUUID(),
          };
          return {
            ...client,
            monthlyData: [...client.monthlyData, newData].sort(
              (a, b) => new Date(b.month).getTime() - new Date(a.month).getTime()
            ),
          };
        }
        return client;
      })
    );
  };

  const updateMonthlyData = (clientId: string, dataId: string, updates: Partial<MonthlyData>) => {
    setClients(prev =>
      prev.map(client => {
        if (client.id === clientId) {
          return {
            ...client,
            monthlyData: client.monthlyData.map(data =>
              data.id === dataId ? { ...data, ...updates } : data
            ),
          };
        }
        return client;
      })
    );
  };

  const deleteMonthlyData = (clientId: string, dataId: string) => {
    setClients(prev =>
      prev.map(client => {
        if (client.id === clientId) {
          return {
            ...client,
            monthlyData: client.monthlyData.filter(data => data.id !== dataId),
          };
        }
        return client;
      })
    );
  };

  // Funções para dados orgânicos
  const addOrganicData = (clientId: string, data: Omit<OrganicTrafficData, 'id'>) => {
    setClients(prev =>
      prev.map(client => {
        if (client.id === clientId) {
          const newData: OrganicTrafficData = {
            ...data,
            id: crypto.randomUUID(),
          };
          return {
            ...client,
            organicData: [...client.organicData, newData].sort(
              (a, b) => new Date(b.month).getTime() - new Date(a.month).getTime()
            ),
          };
        }
        return client;
      })
    );
  };

  const updateOrganicData = (clientId: string, dataId: string, updates: Partial<OrganicTrafficData>) => {
    setClients(prev =>
      prev.map(client => {
        if (client.id === clientId) {
          return {
            ...client,
            organicData: client.organicData.map(data =>
              data.id === dataId ? { ...data, ...updates } : data
            ),
          };
        }
        return client;
      })
    );
  };

  const deleteOrganicData = (clientId: string, dataId: string) => {
    setClients(prev =>
      prev.map(client => {
        if (client.id === clientId) {
          return {
            ...client,
            organicData: client.organicData.filter(data => data.id !== dataId),
          };
        }
        return client;
      })
    );
  };

  const saveReport = (clientId: string, report: Omit<SavedReport, 'id' | 'generatedAt'>) => {
    const newReport: SavedReport = {
      ...report,
      id: crypto.randomUUID(),
      generatedAt: new Date().toISOString(),
    };

    setClients(prev =>
      prev.map(client => {
        if (client.id === clientId) {
          return {
            ...client,
            savedReports: [...(client.savedReports || []), newReport],
          };
        }
        return client;
      })
    );

    return newReport;
  };

  const deleteReport = (clientId: string, reportId: string) => {
    setClients(prev =>
      prev.map(client => {
        if (client.id === clientId) {
          return {
            ...client,
            savedReports: (client.savedReports || []).filter(r => r.id !== reportId),
          };
        }
        return client;
      })
    );
  };

  const updateClientControl = (clientId: string, control: ClientControl) => {
    setClients(prev =>
      prev.map(client => {
        if (client.id === clientId) {
          return {
            ...client,
            control,
          };
        }
        return client;
      })
    );
  };

  const renewService = (clientId: string, type: 'domain' | 'hosting', months: number) => {
    setClients(prev =>
      prev.map(client => {
        if (client.id === clientId && client.control) {
          const currentDate = type === 'domain' 
            ? client.control.domainExpiry 
            : client.control.hostingExpiry;
          
          const baseDate = currentDate && new Date(currentDate) > new Date()
            ? new Date(currentDate)
            : new Date();
          
          baseDate.setMonth(baseDate.getMonth() + months);
          const newDate = baseDate.toISOString().split('T')[0];
          
          return {
            ...client,
            control: {
              ...client.control,
              ...(type === 'domain' 
                ? { domainExpiry: newDate }
                : { hostingExpiry: newDate }
              ),
            },
          };
        }
        return client;
      })
    );
  };

  return {
    clients,
    addClient,
    updateClient,
    deleteClient,
    addMonthlyData,
    updateMonthlyData,
    deleteMonthlyData,
    addOrganicData,
    updateOrganicData,
    deleteOrganicData,
    importClients,
    saveReport,
    deleteReport,
    updateClientControl,
    renewService,
  };
};
