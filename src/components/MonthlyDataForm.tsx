import { useState } from 'react';
import { X, Save } from 'lucide-react';
import type { MonthlyData, Keyword } from '../types';
import { KeywordManager } from './KeywordManager';

interface MonthlyDataFormProps {
  onSubmit: (data: Omit<MonthlyData, 'id'>) => void;
  onCancel: () => void;
  clientName: string;
  editData?: MonthlyData;
}

export const MonthlyDataForm = ({ onSubmit, onCancel, clientName, editData }: MonthlyDataFormProps) => {
  const today = new Date().toISOString().slice(0, 10);
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);
  
  const [formData, setFormData] = useState({
    month: editData?.month || new Date().toISOString().slice(0, 7),
    startDate: editData?.startDate || firstDayOfMonth,
    endDate: editData?.endDate || today,
    clicks: editData?.clicks.toString() || '',
    conversions: editData?.conversions.toString() || '',
    costPerClick: editData?.costPerClick.toString() || '',
    totalSpent: editData?.totalSpent.toString() || '',
    impressions: editData?.impressions.toString() || '',
    conversionRate: editData?.conversionRate.toString() || '',
    topKeywords: editData?.topKeywords || '',
  });

  const [keywords, setKeywords] = useState<Keyword[]>(editData?.keywords || []);

  // Atualizar mês automaticamente quando a data final mudar
  const handleEndDateChange = (newEndDate: string) => {
    setFormData({ 
      ...formData, 
      endDate: newEndDate,
      month: newEndDate.slice(0, 7) // YYYY-MM da data final
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      month: formData.month,
      startDate: formData.startDate,
      endDate: formData.endDate,
      clicks: Number(formData.clicks),
      conversions: Number(formData.conversions),
      costPerClick: Number(formData.costPerClick),
      totalSpent: Number(formData.totalSpent),
      impressions: Number(formData.impressions),
      conversionRate: Number(formData.conversionRate),
      keywords: keywords.length > 0 ? keywords : undefined,
      topKeywords: formData.topKeywords.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl m-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {editData ? 'Editar Dados Mensais' : 'Adicionar Dados Mensais'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">Cliente: {clientName}</p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Inicial *
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Final * (define o mês)
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={e => handleEndDateChange(e.target.value)}
                min={formData.startDate}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">O mês será baseado nesta data</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cliques *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.clicks}
                onChange={e => setFormData({ ...formData, clicks: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Impressões *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.impressions}
                onChange={e => setFormData({ ...formData, impressions: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Conversões *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.conversions}
                onChange={e => setFormData({ ...formData, conversions: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Taxa de Conversão (%) *
              </label>
              <input
                type="number"
                required
                min="0"
                max="100"
                step="0.01"
                value={formData.conversionRate}
                onChange={e => setFormData({ ...formData, conversionRate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custo por Clique (R$) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.costPerClick}
                onChange={e => setFormData({ ...formData, costPerClick: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor Total Gasto (R$) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.totalSpent}
                onChange={e => setFormData({ ...formData, totalSpent: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Gerenciador de Palavras-Chave */}
          <div className="mt-4">
            <KeywordManager keywords={keywords} onChange={setKeywords} />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Salvar Dados
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
