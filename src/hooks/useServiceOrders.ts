import { useState, useEffect } from 'react';
import type { ServiceOrder, ServiceOrderItem } from '../types';
import { API_URL } from '../config';

const STORAGE_KEY = 'adspanel_service_orders';
const API_ORDERS_URL = `${API_URL}/service-orders`;

export const useServiceOrders = () => {
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);

  // Carregar ordens de serviço da API (com fallback para localStorage)
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(API_ORDERS_URL, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setServiceOrders(data.serviceOrders || []);
        } else {
          // Fallback para localStorage se API falhar
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            setServiceOrders(JSON.parse(stored));
          }
        }
      } catch (error) {
        console.error('Erro ao carregar ordens:', error);
        // Fallback para localStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setServiceOrders(JSON.parse(stored));
        }
      }
    };

    loadOrders();
  }, []);

  // Salvar na API e localStorage sempre que houver mudanças
  const saveToBackend = async (orders: ServiceOrder[]) => {
    try {
      const token = localStorage.getItem('auth_token');
      await fetch(API_ORDERS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ serviceOrders: orders })
      });
      
      // Também salvar no localStorage como backup
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error('Erro ao salvar ordens:', error);
      // Salvar no localStorage mesmo se API falhar
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    }
  };

  // Gerar número da OS
  const generateOrderNumber = (): string => {
    const year = new Date().getFullYear();
    const count = serviceOrders.filter(so => so.number.startsWith(`OS-${year}`)).length + 1001;
    return `OS-${year}-${String(count).padStart(4, '0')}`;
  };

  // Adicionar nova ordem de serviço
  const addServiceOrder = (order: Omit<ServiceOrder, 'id' | 'number' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: ServiceOrder = {
      ...order,
      id: crypto.randomUUID(),
      number: generateOrderNumber(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedOrders = [...serviceOrders, newOrder];
    setServiceOrders(updatedOrders);
    saveToBackend(updatedOrders);
    return newOrder;
  };

  // Atualizar ordem de serviço
  const updateServiceOrder = (id: string, updates: Partial<ServiceOrder>) => {
    const updatedOrders = serviceOrders.map(order =>
      order.id === id
        ? { ...order, ...updates, updatedAt: new Date().toISOString() }
        : order
    );
    setServiceOrders(updatedOrders);
    saveToBackend(updatedOrders);
  };

  // Deletar ordem de serviço
  const deleteServiceOrder = (id: string) => {
    const updatedOrders = serviceOrders.filter(order => order.id !== id);
    setServiceOrders(updatedOrders);
    saveToBackend(updatedOrders);
  };

  // Calcular totais de um item
  const calculateItemTotal = (item: ServiceOrderItem): number => {
    return item.quantity * item.unitPrice;
  };

  // Calcular subtotal da OS
  const calculateSubtotal = (items: ServiceOrderItem[]): number => {
    return items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  // Calcular total com desconto
  const calculateTotal = (subtotal: number, discount: number): number => {
    return Math.max(0, subtotal - discount);
  };

  // Aplicar desconto percentual
  const applyDiscountPercent = (subtotal: number, discountPercent: number): number => {
    return (subtotal * discountPercent) / 100;
  };

  // Obter estatísticas
  const getStatistics = () => {
    const total = serviceOrders.length;
    const pending = serviceOrders.filter(so => so.status === 'pending').length;
    const inProgress = serviceOrders.filter(so => so.status === 'in_progress').length;
    const completed = serviceOrders.filter(so => so.status === 'completed').length;
    const cancelled = serviceOrders.filter(so => so.status === 'cancelled').length;
    const totalRevenue = serviceOrders
      .filter(so => so.status === 'completed')
      .reduce((sum, so) => sum + so.total, 0);

    return {
      total,
      pending,
      inProgress,
      completed,
      cancelled,
      totalRevenue,
    };
  };

  return {
    serviceOrders,
    addServiceOrder,
    updateServiceOrder,
    deleteServiceOrder,
    calculateItemTotal,
    calculateSubtotal,
    calculateTotal,
    applyDiscountPercent,
    getStatistics,
  };
};
