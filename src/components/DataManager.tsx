import { useState } from 'react';
import { Download, Upload, Database, AlertCircle, CheckCircle } from 'lucide-react';
import { exportDataToJSON, importDataFromJSON } from '../utils/dataExport';
import type { Client } from '../types';

interface DataManagerProps {
  clients: Client[];
  onImport: (clients: Client[]) => void;
}

export const DataManager = ({ clients, onImport }: DataManagerProps) => {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExport = () => {
    try {
      exportDataToJSON(clients);
      setMessage({ type: 'success', text: 'Dados exportados com sucesso!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao exportar dados' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await importDataFromJSON(file);
      onImport(data);
      setMessage({ type: 'success', text: 'Dados importados com sucesso!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao importar dados: arquivo inválido' });
      setTimeout(() => setMessage(null), 3000);
    }

    // Limpar input
    event.target.value = '';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-800">Gerenciar Dados</h3>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-gray-600">
          Os dados são salvos automaticamente no navegador. Use as opções abaixo para fazer backup ou restaurar.
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar Dados (JSON)
          </button>

          <label className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            Importar Dados (JSON)
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>

        {message && (
          <div className={`flex items-center gap-2 p-3 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>💾 Onde os dados ficam salvos:</strong><br />
            • Os dados são salvos no <strong>localStorage</strong> do navegador<br />
            • Ficam disponíveis mesmo após fechar o navegador<br />
            • Recomendamos fazer backup regularmente exportando para JSON<br />
            • Total de clientes: <strong>{clients.length}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};
