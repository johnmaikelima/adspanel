import { Users, Plus, TrendingUp } from 'lucide-react';
import type { Client } from '../types';

interface ClientListProps {
  clients: Client[];
  selectedClient: Client | null;
  onSelectClient: (client: Client) => void;
  onAddClient: () => void;
}

export const ClientList = ({ clients, selectedClient, onSelectClient, onAddClient }: ClientListProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Clientes</h2>
        </div>
        <button
          onClick={onAddClient}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Cliente
        </button>
      </div>

      {clients.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p>Nenhum cliente cadastrado</p>
          <p className="text-sm mt-2">Clique em "Novo Cliente" para começar</p>
        </div>
      ) : (
        <div className="space-y-2">
          {clients.map(client => {
            const latestData = client.monthlyData[0];
            return (
              <button
                key={client.id}
                onClick={() => onSelectClient(client)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedClient?.id === client.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{client.name}</h3>
                    {client.company && (
                      <p className="text-sm text-gray-600">{client.company}</p>
                    )}
                    <p className="text-sm text-gray-500">{client.email}</p>
                  </div>
                  {latestData && (
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <TrendingUp className="w-4 h-4" />
                        {client.monthlyData.length} meses
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Último: {new Date(latestData.month + '-01').toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
