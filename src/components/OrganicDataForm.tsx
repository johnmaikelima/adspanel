import { useState } from 'react';
import { X, Save, TrendingUp } from 'lucide-react';
import type { OrganicTrafficData, OrganicKeyword } from '../types';
import { OrganicKeywordManager } from './OrganicKeywordManager';

interface OrganicDataFormProps {
  onSubmit: (data: Omit<OrganicTrafficData, 'id'>) => void;
  onCancel: () => void;
  clientName: string;
  editData?: OrganicTrafficData;
}

export const OrganicDataForm = ({ onSubmit, onCancel, clientName, editData }: OrganicDataFormProps) => {
  const today = new Date().toISOString().slice(0, 10);
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);
  
  const [formData, setFormData] = useState({
    month: editData?.month || new Date().toISOString().slice(0, 7),
    startDate: editData?.startDate || firstDayOfMonth,
    endDate: editData?.endDate || today,
    impressions: editData?.impressions?.toString() || '',
    clicks: editData?.clicks?.toString() || '',
    averagePosition: editData?.averagePosition?.toString() || '',
    sessions: editData?.sessions?.toString() || '',
    users: editData?.users?.toString() || '',
    pageViews: editData?.pageViews?.toString() || '',
    avgSessionDuration: editData?.avgSessionDuration?.toString() || '',
    bounceRate: editData?.bounceRate?.toString() || '',
    organicConversions: editData?.organicConversions?.toString() || '',
    conversionRate: editData?.conversionRate?.toString() || '',
    topKeywords: editData?.topKeywords?.join(', ') || '',
  });

  const [keywords, setKeywords] = useState<OrganicKeyword[]>(editData?.keywords || []);

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
    const topKeywords = formData.topKeywords.trim() 
      ? formData.topKeywords.split(',').map(k => k.trim()).filter(k => k.length > 0)
      : undefined;

    const data: any = {
      month: formData.month,
      startDate: formData.startDate,
      endDate: formData.endDate,
      impressions: Number(formData.impressions),
      clicks: Number(formData.clicks),
      averagePosition: Number(formData.averagePosition),
      keywords: keywords.length > 0 ? keywords : undefined,
    };

    // Adicionar campos opcionais apenas se tiverem valor
    if (formData.sessions && formData.sessions.trim() !== '') {
      data.sessions = Number(formData.sessions);
    }
    if (formData.users && formData.users.trim() !== '') {
      data.users = Number(formData.users);
    }
    if (formData.pageViews && formData.pageViews.trim() !== '') {
      data.pageViews = Number(formData.pageViews);
    }
    if (formData.avgSessionDuration && formData.avgSessionDuration.trim() !== '') {
      data.avgSessionDuration = Number(formData.avgSessionDuration);
    }
    if (formData.bounceRate && formData.bounceRate.trim() !== '') {
      data.bounceRate = Number(formData.bounceRate);
    }
    if (formData.organicConversions && formData.organicConversions.trim() !== '') {
      data.organicConversions = Number(formData.organicConversions);
    }
    if (formData.conversionRate && formData.conversionRate.trim() !== '') {
      data.conversionRate = Number(formData.conversionRate);
    }
    if (topKeywords && topKeywords.length > 0) {
      data.topKeywords = topKeywords;
    }

    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl m-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              {editData ? 'Editar Dados Orgânicos' : 'Adicionar Dados Orgânicos'}
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">O mês será baseado nesta data</p>
            </div>
          </div>

          {/* Campos Obrigatórios */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">📊 Métricas Principais (Obrigatórias)</h3>
            <div className="grid grid-cols-3 gap-4">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Posição Média *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.1"
                  value={formData.averagePosition}
                  onChange={e => setFormData({ ...formData, averagePosition: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.0"
                />
              </div>
            </div>
          </div>

          {/* Campos Opcionais */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">📈 Métricas Adicionais (Opcionais)</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Sessões
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.sessions}
                  onChange={e => setFormData({ ...formData, sessions: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Opcional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Usuários Únicos
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.users}
                  onChange={e => setFormData({ ...formData, users: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Opcional"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Visualizações de Página
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.pageViews}
                  onChange={e => setFormData({ ...formData, pageViews: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Opcional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Duração Média (segundos)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.avgSessionDuration}
                  onChange={e => setFormData({ ...formData, avgSessionDuration: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Opcional"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Taxa de Rejeição (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.bounceRate}
                  onChange={e => setFormData({ ...formData, bounceRate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Opcional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Conversões Orgânicas
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.organicConversions}
                  onChange={e => setFormData({ ...formData, organicConversions: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Opcional"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Taxa de Conversão (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.conversionRate}
                onChange={e => setFormData({ ...formData, conversionRate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Opcional"
              />
            </div>
          </div>

          {/* Gerenciador de Palavras-Chave Orgânicas */}
          <div className="mt-4">
            <OrganicKeywordManager keywords={keywords} onChange={setKeywords} />
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
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
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
