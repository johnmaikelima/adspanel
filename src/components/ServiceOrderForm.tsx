import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import type { ServiceOrder, ServiceOrderItem, Client } from '../types';

interface ServiceOrderFormProps {
  order?: ServiceOrder;
  clients: Client[];
  onSave: (order: Omit<ServiceOrder, 'id' | 'number' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
  currentUser: string;
}

export const ServiceOrderForm = ({ order, clients, onSave, onClose, currentUser }: ServiceOrderFormProps) => {
  const [clientId, setClientId] = useState(order?.clientId || '');
  const [clientName, setClientName] = useState(order?.clientName || '');
  const [clientEmail, setClientEmail] = useState(order?.clientEmail || '');
  const [clientPhone, setClientPhone] = useState(order?.clientPhone || '');
  const [clientAddress, setClientAddress] = useState(order?.clientAddress || '');
  const [status, setStatus] = useState<ServiceOrder['status']>(order?.status || 'pending');
  const [priority, setPriority] = useState<ServiceOrder['priority']>(order?.priority || 'medium');
  const [title, setTitle] = useState(order?.title || '');
  const [description, setDescription] = useState(order?.description || '');
  const [items, setItems] = useState<ServiceOrderItem[]>(order?.items || []);
  const [discountPercent, setDiscountPercent] = useState(order?.discountPercent || 0);
  const [notes, setNotes] = useState(order?.notes || '');
  const [terms, setTerms] = useState(order?.terms || 'Pagamento à vista ou parcelado.\nValidade da proposta: 7 dias.\nGarantia: 90 dias.');

  // Quando selecionar um cliente, preencher dados
  useEffect(() => {
    if (clientId) {
      const client = clients.find(c => c.id === clientId);
      if (client) {
        setClientName(client.name);
        setClientEmail(client.email || '');
      }
    }
  }, [clientId, clients]);

  // Calcular totais
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const discount = (subtotal * discountPercent) / 100;
  const total = subtotal - discount;

  // Adicionar item
  const addItem = () => {
    const newItem: ServiceOrderItem = {
      id: crypto.randomUUID(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    setItems([...items, newItem]);
  };

  // Atualizar item
  const updateItem = (id: string, field: keyof ServiceOrderItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        updated.total = updated.quantity * updated.unitPrice;
        return updated;
      }
      return item;
    }));
  };

  // Remover item
  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Salvar
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientName || !title || items.length === 0) {
      alert('Preencha todos os campos obrigatórios e adicione pelo menos um item!');
      return;
    }

    const orderData: Omit<ServiceOrder, 'id' | 'number' | 'createdAt' | 'updatedAt'> = {
      clientId,
      clientName,
      clientEmail,
      clientPhone,
      clientAddress,
      status,
      priority,
      title,
      description,
      items,
      subtotal,
      discount,
      discountPercent,
      total,
      notes,
      terms,
      completedAt: status === 'completed' ? new Date().toISOString() : order?.completedAt,
      createdBy: order?.createdBy || currentUser,
    };

    onSave(orderData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {order ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Dados do Cliente */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-gray-800">Dados do Cliente</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selecionar Cliente
                </label>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Novo cliente (preencher manualmente)</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Cliente *
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço
                </label>
                <input
                  type="text"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Dados da OS */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Dados da Ordem de Serviço</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ServiceOrder['status'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pendente</option>
                  <option value="in_progress">Em Andamento</option>
                  <option value="completed">Concluída</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prioridade
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as ServiceOrder['priority'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título/Assunto *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Desenvolvimento de Website"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição do Serviço
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Descreva os detalhes do serviço..."
                />
              </div>
            </div>
          </div>

          {/* Itens/Serviços */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Itens/Serviços *</h3>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                <Plus className="w-4 h-4" />
                Adicionar Item
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-2 items-start bg-gray-50 p-3 rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-2">
                    <div className="md:col-span-6">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Descrição do item"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Qtd"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Valor Unit."
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        value={`R$ ${(item.quantity * item.unitPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-sm"
                        disabled
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Totais */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-semibold">
                R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            
            <div className="flex justify-between items-center gap-4">
              <span className="text-gray-700">Desconto (%):</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="100"
                  step="0.01"
                />
                <span className="font-semibold">
                  - R$ {discount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-300">
              <span className="text-lg font-bold text-gray-800">Total:</span>
              <span className="text-2xl font-bold text-blue-600">
                R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Observações e Termos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações Internas
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Observações que não aparecerão no PDF..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Termos e Condições
              </label>
              <textarea
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Termos que aparecerão no PDF..."
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {order ? 'Atualizar' : 'Criar'} Ordem de Serviço
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
