import { useState } from 'react';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import type { OrganicKeyword } from '../types';

interface OrganicKeywordManagerProps {
  keywords: OrganicKeyword[];
  onChange: (keywords: OrganicKeyword[]) => void;
}

export const OrganicKeywordManager = ({ keywords, onChange }: OrganicKeywordManagerProps) => {
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkText, setBulkText] = useState('');

  const handleBulkImport = () => {
    const lines = bulkText.trim().split('\n');
    const newKeywords: OrganicKeyword[] = [];
    
    // Processar cada linha (formato: palavra-chave [tabs/espaços] cliques [tabs/espaços] impressões)
    for (const line of lines) {
      if (!line.trim()) continue;
      
      // Dividir por tabs ou múltiplos espaços
      const parts = line.trim().split(/\t+|\s{2,}/).filter(p => p.trim());
      
      if (parts.length >= 3) {
        // Últimos dois valores são cliques e impressões
        const impressions = parseInt(parts[parts.length - 1]) || 0;
        const clicks = parseInt(parts[parts.length - 2]) || 0;
        // Tudo antes disso é o nome da palavra-chave
        const name = parts.slice(0, -2).join(' ').trim();
        
        if (name) {
          newKeywords.push({
            id: crypto.randomUUID(),
            name,
            clicks,
            impressions,
          });
        }
      }
    }
    
    onChange([...keywords, ...newKeywords]);
    setBulkText('');
    setShowBulkImport(false);
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
            Principais Palavras-Chave Orgânicas (Opcional)
          </label>
          <p className="text-xs text-gray-500 mt-1">
            💡 Adicione as palavras-chave mais relevantes do Search Console
          </p>
        </div>
        {!showBulkImport && (
          <button
            type="button"
            onClick={() => setShowBulkImport(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Importar em Massa
          </button>
        )}
      </div>

      {/* Importação em Massa */}
      {showBulkImport && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-800 text-sm">Importar Palavras-Chave</h4>
            <button
              type="button"
              onClick={() => {
                setShowBulkImport(false);
                setBulkText('');
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <p className="text-xs text-gray-600">
            Cole os dados diretamente do Search Console (formato: palavra-chave, cliques, impressões):
          </p>
          
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none font-mono text-sm"
            rows={10}
            placeholder="manutenção pneumática    2    47&#10;integridade estrutural    1    92&#10;manutenção pneumática    1    31&#10;montagem e manutenção industrial    1    3"
            autoFocus
          />
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleBulkImport}
              disabled={!bulkText.trim()}
              className="flex items-center gap-1 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Importar {bulkText.trim() ? `(${bulkText.trim().split('\n').filter(l => l.trim()).length} palavras-chave)` : ''}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowBulkImport(false);
                setBulkText('');
              }}
              className="flex items-center gap-1 px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de Palavras-Chave */}
      {keywords.length > 0 && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-600 px-3 py-2 bg-gray-100 rounded-lg sticky top-0">
            <span className="flex-1">Palavra-Chave</span>
            <span className="w-20 text-center">Cliques</span>
            <span className="w-24 text-center">Impressões</span>
            <span className="w-16 text-center">CTR</span>
            <span className="w-8"></span>
          </div>
          {keywords.map((keyword) => (
            <div
              key={keyword.id}
              className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors"
            >
              <span className="flex-1 text-sm text-gray-800 truncate pr-2" title={keyword.name}>
                {keyword.name}
              </span>
              <span className="w-20 text-center text-sm font-medium text-gray-700">
                {keyword.clicks}
              </span>
              <span className="w-24 text-center text-sm font-medium text-gray-700">
                {keyword.impressions.toLocaleString('pt-BR')}
              </span>
              <span className="w-16 text-center text-sm font-medium text-blue-600">
                {calculateCTR(keyword.clicks, keyword.impressions)}%
              </span>
              <button
                type="button"
                onClick={() => handleDelete(keyword.id)}
                className="w-8 p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Excluir"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {keywords.length === 0 && !showBulkImport && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-sm text-gray-600 mb-1">
            Nenhuma palavra-chave adicionada
          </p>
          <p className="text-xs text-gray-500">
            Clique em "Importar em Massa" para adicionar palavras-chave do Search Console
          </p>
        </div>
      )}

      {keywords.length > 0 && (
        <div className="flex items-center justify-between text-xs text-gray-600 px-3 py-2 bg-blue-50 rounded-lg">
          <span className="font-medium">
            📊 Total: {keywords.length} palavras-chave
          </span>
          <span>
            {keywords.reduce((sum, kw) => sum + kw.clicks, 0)} cliques • {' '}
            {keywords.reduce((sum, kw) => sum + kw.impressions, 0).toLocaleString('pt-BR')} impressões
          </span>
        </div>
      )}
    </div>
  );
};
