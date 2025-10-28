import { useState } from 'react';
import { Users, AlertTriangle, Calendar, DollarSign, Globe, RefreshCw, Edit2, UserPlus } from 'lucide-react';
import type { Client } from '../types';

interface ControlDashboardProps {
  clients: Client[];
  onEditControl: (client: Client) => void;
  onRenew: (client: Client, type: 'domain' | 'hosting', months: number) => void;
  onAddClient: () => void;
}

export const ControlDashboard = ({ clients, onEditControl, onRenew, onAddClient }: ControlDashboardProps) => {
  const [renewingClient, setRenewingClient] = useState<{ client: Client; type: 'domain' | 'hosting' } | null>(null);
  const [renewMonths, setRenewMonths] = useState('12');
  const [filter, setFilter] = useState<'all' | 'expired' | 'upcoming'>('all');

  // Calcular estatísticas
  const totalClients = clients.length;
  const clientsWithControl = clients.filter(c => c.control).length;
  const totalRevenue = clients.reduce((sum, c) => sum + (c.control?.annualFee || 0), 0);

  // Função para calcular dias até vencimento
  const getDaysUntilExpiry = (expiryDate?: string) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Filtrar vencimentos próximos (30 dias)
  const upcomingExpirations = clients.filter(c => {
    if (!c.control) return false;
    const domainDays = getDaysUntilExpiry(c.control.domainExpiry);
    const hostingDays = getDaysUntilExpiry(c.control.hostingExpiry);
    return (domainDays !== null && domainDays <= 30 && domainDays >= 0) ||
           (hostingDays !== null && hostingDays <= 30 && hostingDays >= 0);
  });

  // Vencimentos vencidos
  const expiredItems = clients.filter(c => {
    if (!c.control) return false;
    const domainDays = getDaysUntilExpiry(c.control.domainExpiry);
    const hostingDays = getDaysUntilExpiry(c.control.hostingExpiry);
    return (domainDays !== null && domainDays < 0) ||
           (hostingDays !== null && hostingDays < 0);
  });

  const handleRenewConfirm = () => {
    if (!renewingClient) return;
    onRenew(renewingClient.client, renewingClient.type, parseInt(renewMonths));
    setRenewingClient(null);
    setRenewMonths('12');
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const getExpiryStatus = (days: number | null) => {
    if (days === null) return { color: 'gray', text: 'Não definido' };
    if (days < 0) return { color: 'red', text: `Vencido há ${Math.abs(days)} dias` };
    if (days === 0) return { color: 'red', text: 'Vence hoje!' };
    if (days <= 7) return { color: 'red', text: `${days} dias` };
    if (days <= 30) return { color: 'orange', text: `${days} dias` };
    return { color: 'green', text: `${days} dias` };
  };

  // Filtrar clientes baseado no filtro selecionado
  const filteredClients = clients.filter(client => {
    if (filter === 'all') return true;
    
    if (!client.control) return false;
    
    const domainDays = getDaysUntilExpiry(client.control.domainExpiry);
    const hostingDays = getDaysUntilExpiry(client.control.hostingExpiry);
    
    if (filter === 'expired') {
      return (domainDays !== null && domainDays < 0) || (hostingDays !== null && hostingDays < 0);
    }
    
    if (filter === 'upcoming') {
      return (domainDays !== null && domainDays >= 0 && domainDays <= 30) || 
             (hostingDays !== null && hostingDays >= 0 && hostingDays <= 30);
    }
    
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total de Clientes</p>
              <p className="text-3xl font-bold mt-2">{totalClients}</p>
            </div>
            <Users className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Com Controle</p>
              <p className="text-3xl font-bold mt-2">{clientsWithControl}</p>
            </div>
            <Globe className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Vencimentos Próximos</p>
              <p className="text-3xl font-bold mt-2">{upcomingExpirations.length}</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Receita Anual</p>
              <p className="text-3xl font-bold mt-2">
                R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <DollarSign className="w-12 h-12 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Alertas de Vencimento */}
      {expiredItems.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-800">Itens Vencidos!</h3>
              <p className="text-sm text-red-700 mt-1">
                {expiredItems.length} cliente(s) com domínio ou hospedagem vencidos
              </p>
            </div>
          </div>
        </div>
      )}

      {upcomingExpirations.length > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-orange-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-orange-800">Vencimentos Próximos</h3>
              <p className="text-sm text-orange-700 mt-1">
                {upcomingExpirations.length} cliente(s) com vencimento nos próximos 30 dias
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Clientes */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Controle de Clientes</h2>
          <button
            onClick={onAddClient}
            className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            <UserPlus className="w-4 h-4" />
            Novo Cliente
          </button>
        </div>

        {/* Filtros */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 mr-2">Filtrar:</span>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Todos ({clients.length})
            </button>
            <button
              onClick={() => setFilter('expired')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'expired'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Vencidos ({expiredItems.length})
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'upcoming'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              A Vencer (30 dias) ({upcomingExpirations.length})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Domínio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Venc. Domínio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Venc. Hospedagem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Anual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map(client => {
                const domainDays = getDaysUntilExpiry(client.control?.domainExpiry);
                const hostingDays = getDaysUntilExpiry(client.control?.hostingExpiry);
                const domainStatus = getExpiryStatus(domainDays);
                const hostingStatus = getExpiryStatus(hostingDays);

                return (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{client.name}</div>
                        {client.company && (
                          <div className="text-sm text-gray-500">{client.company}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {client.control?.domain || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(client.control?.domainExpiry)}</div>
                      <div className={`text-xs font-medium text-${domainStatus.color}-600`}>
                        {domainStatus.text}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(client.control?.hostingExpiry)}</div>
                      <div className={`text-xs font-medium text-${hostingStatus.color}-600`}>
                        {hostingStatus.text}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {client.control?.annualFee 
                        ? `R$ ${client.control.annualFee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEditControl(client)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar controle"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {client.control?.domainExpiry && (
                          <button
                            onClick={() => setRenewingClient({ client, type: 'domain' })}
                            className="text-green-600 hover:text-green-900"
                            title="Renovar domínio"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredClients.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>
                {filter === 'all' 
                  ? 'Nenhum cliente cadastrado'
                  : filter === 'expired'
                  ? 'Nenhum cliente com vencimento atrasado'
                  : 'Nenhum cliente com vencimento nos próximos 30 dias'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Renovação */}
      {renewingClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Renovar {renewingClient.type === 'domain' ? 'Domínio' : 'Hospedagem'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Cliente: <strong>{renewingClient.client.name}</strong>
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período de Renovação
              </label>
              <select
                value={renewMonths}
                onChange={(e) => setRenewMonths(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1">1 mês</option>
                <option value="3">3 meses</option>
                <option value="6">6 meses</option>
                <option value="12">12 meses (1 ano)</option>
                <option value="24">24 meses (2 anos)</option>
                <option value="36">36 meses (3 anos)</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setRenewingClient(null);
                  setRenewMonths('12');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleRenewConfirm}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Renovar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
