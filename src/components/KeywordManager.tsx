import { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import type { Keyword } from '../types';

interface KeywordManagerProps {
  keywords: Keyword[];
  onChange: (keywords: Keyword[]) => void;
}

export const KeywordManager = ({ keywords, onChange }: KeywordManagerProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    clicks: '',
    impressions: '',
    cpc: '',
    conversions: '',
    cost: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      clicks: '',
      impressions: '',
      cpc: '',
      conversions: '',
      cost: '',
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleAdd = () => {
    if (!formData.name.trim()) return;

    const newKeyword: Keyword = {
      id: crypto.randomUUID(),
      name: formData.name.trim(),
      clicks: Number(formData.clicks) || 0,
      impressions: Number(formData.impressions) || 0,
      cpc: Number(formData.cpc) || 0,
      conversions: Number(formData.conversions) || 0,
      cost: Number(formData.cost) || 0,
    };

    onChange([...keywords, newKeyword]);
    resetForm();
  };

  const handleEdit = (keyword: Keyword) => {
    setEditingId(keyword.id);
    setFormData({
      name: keyword.name,
      clicks: keyword.clicks.toString(),
      impressions: keyword.impressions.toString(),
      cpc: keyword.cpc.toString(),
      conversions: keyword.conversions.toString(),
      cost: keyword.cost.toString(),
    });
  };

  const handleUpdate = () => {
    if (!editingId || !formData.name.trim()) return;

    const updatedKeywords = keywords.map(kw => 
      kw.id === editingId
        ? {
            ...kw,
            name: formData.name.trim(),
            clicks: Number(formData.clicks) || 0,
            impressions: Number(formData.impressions) || 0,
            cpc: Number(formData.cpc) || 0,
            conversions: Number(formData.conversions) || 0,
            cost: Number(formData.cost) || 0,
          }
        : kw
    );

    onChange(updatedKeywords);
    resetForm();
  };

  const handleDelete = (id: string) => {
    onChange(keywords.filter(kw => kw.id !== id));
  };

  const calculateCTR = (clicks: number, impressions: number) => {
    if (impressions === 0) return 0;
    return ((clicks / impressions) * 100).toFixed(2);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Principais Palavras-Chave (Opcional)
          </label>
          <p className="text-xs text-gray-500 mt-1">
            💡 Adicione apenas as palavras-chave mais relevantes para análise
          </p>
        </div>
        {!isAdding && !editingId && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </button>
        )}
      </div>

      {/* Lista de Palavras-Chave */}
      {keywords.length > 0 && (
        <div className="space-y-2">
          {keywords.map((keyword) => (
            <div
              key={keyword.id}
              className="bg-gray-50 border border-gray-200 rounded-lg p-3"
            >
              {editingId === keyword.id ? (
                // Modo de Edição
                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Nome da palavra-chave"
                  />
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <input
                      type="number"
                      value={formData.clicks}
                      onChange={(e) => setFormData({ ...formData, clicks: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Cliques"
                      min="0"
                    />
                    <input
                      type="number"
                      value={formData.impressions}
                      onChange={(e) => setFormData({ ...formData, impressions: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Impressões"
                      min="0"
                    />
                    <input
                      type="number"
                      value={formData.cpc}
                      onChange={(e) => setFormData({ ...formData, cpc: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="CPC (R$)"
                      min="0"
                      step="0.01"
                    />
                    <input
                      type="number"
                      value={formData.conversions}
                      onChange={(e) => setFormData({ ...formData, conversions: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Conversões"
                      min="0"
                    />
                    <input
                      type="number"
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Custo (R$)"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleUpdate}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Salvar
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                // Modo de Visualização
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-2">{keyword.name}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-xs text-gray-600">
                      <div><span className="font-medium">Cliques:</span> {keyword.clicks.toLocaleString('pt-BR')}</div>
                      <div><span className="font-medium">Impressões:</span> {keyword.impressions.toLocaleString('pt-BR')}</div>
                      <div><span className="font-medium">CPC:</span> R$ {keyword.cpc.toFixed(2)}</div>
                      <div><span className="font-medium">Conversões:</span> {keyword.conversions}</div>
                      <div><span className="font-medium">Custo:</span> R$ {keyword.cost.toFixed(2)}</div>
                      <div><span className="font-medium">CTR:</span> {calculateCTR(keyword.clicks, keyword.impressions)}%</div>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(keyword)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(keyword.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Formulário de Adicionar */}
      {isAdding && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold text-gray-800 text-sm">Nova Palavra-Chave</h4>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Nome da palavra-chave *"
            autoFocus
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <input
              type="number"
              value={formData.clicks}
              onChange={(e) => setFormData({ ...formData, clicks: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Cliques"
              min="0"
            />
            <input
              type="number"
              value={formData.impressions}
              onChange={(e) => setFormData({ ...formData, impressions: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Impressões"
              min="0"
            />
            <input
              type="number"
              value={formData.cpc}
              onChange={(e) => setFormData({ ...formData, cpc: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="CPC (R$)"
              min="0"
              step="0.01"
            />
            <input
              type="number"
              value={formData.conversions}
              onChange={(e) => setFormData({ ...formData, conversions: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Conversões"
              min="0"
            />
            <input
              type="number"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Custo Total (R$)"
              min="0"
              step="0.01"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={!formData.name.trim()}
              className="flex items-center gap-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Adicionar
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-1 px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        </div>
      )}

      {keywords.length === 0 && !isAdding && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-sm text-gray-600 mb-1">
            Nenhuma palavra-chave adicionada
          </p>
          <p className="text-xs text-gray-500">
            Adicione as principais palavras-chave para análise detalhada no relatório
          </p>
        </div>
      )}
    </div>
  );
};
