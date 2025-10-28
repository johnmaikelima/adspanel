import { useState } from 'react';
import { X, Save, Calendar, DollarSign, Globe } from 'lucide-react';
import type { ClientControl } from '../types';

interface ClientControlFormProps {
  clientName: string;
  control?: ClientControl;
  onSubmit: (control: ClientControl) => void;
  onCancel: () => void;
}

export const ClientControlForm = ({ clientName, control, onSubmit, onCancel }: ClientControlFormProps) => {
  const [formData, setFormData] = useState({
    domain: control?.domain || '',
    domainExpiry: control?.domainExpiry || '',
    hostingExpiry: control?.hostingExpiry || '',
    annualFee: control?.annualFee?.toString() || '',
    notes: control?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const controlData: ClientControl = {
      domain: formData.domain.trim() || undefined,
      domainExpiry: formData.domainExpiry || undefined,
      hostingExpiry: formData.hostingExpiry || undefined,
      annualFee: formData.annualFee ? Number(formData.annualFee) : undefined,
      notes: formData.notes.trim() || undefined,
    };

    onSubmit(controlData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl m-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Controle do Cliente
            </h2>
            <p className="text-sm text-gray-600 mt-1">{clientName}</p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Domínio */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Globe className="w-4 h-4 text-blue-600" />
              Domínio
            </label>
            <input
              type="text"
              value={formData.domain}
              onChange={e => setFormData({ ...formData, domain: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="exemplo.com.br"
            />
          </div>

          {/* Datas de Vencimento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 text-orange-600" />
                Vencimento do Domínio
              </label>
              <input
                type="date"
                value={formData.domainExpiry}
                onChange={e => setFormData({ ...formData, domainExpiry: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                Vencimento da Hospedagem
              </label>
              <input
                type="date"
                value={formData.hostingExpiry}
                onChange={e => setFormData({ ...formData, hostingExpiry: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Valor Anual */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              Valor Anual (R$)
            </label>
            <input
              type="number"
              value={formData.annualFee}
              onChange={e => setFormData({ ...formData, annualFee: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Informações adicionais sobre o cliente..."
            />
          </div>

          {/* Botões */}
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
              Salvar Controle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
