import { Calendar, CheckSquare, Square } from 'lucide-react';
import type { MonthlyData, OrganicTrafficData } from '../types';

type PeriodData = MonthlyData | OrganicTrafficData;

interface PeriodSelectorProps {
  monthlyData: PeriodData[];
  selectedPeriods: string[];
  onSelectPeriods: (periods: string[]) => void;
}

export const PeriodSelector = ({ monthlyData, selectedPeriods, onSelectPeriods }: PeriodSelectorProps) => {
  const togglePeriod = (periodId: string) => {
    if (selectedPeriods.includes(periodId)) {
      onSelectPeriods(selectedPeriods.filter(id => id !== periodId));
    } else {
      onSelectPeriods([...selectedPeriods, periodId]);
    }
  };

  const toggleAll = () => {
    if (selectedPeriods.length === monthlyData.length) {
      onSelectPeriods([]);
    } else {
      onSelectPeriods(monthlyData.map(d => d.id));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { 
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  if (monthlyData.length === 0) {
    return null;
  }

  const allSelected = selectedPeriods.length === monthlyData.length;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Selecionar Período para Análise</h3>
        </div>
        <button
          onClick={toggleAll}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {allSelected ? (
            <>
              <CheckSquare className="w-4 h-4" />
              Desmarcar Todos
            </>
          ) : (
            <>
              <Square className="w-4 h-4" />
              Selecionar Todos
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {monthlyData.map((data) => {
          const isSelected = selectedPeriods.includes(data.id);
          return (
            <button
              key={data.id}
              onClick={() => togglePeriod(data.id)}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="font-medium text-gray-800 text-sm">
                      {(() => {
                        // Usar UTC para evitar problemas de timezone
                        const [year, month] = data.month.split('-');
                        const date = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, 15));
                        return date.toLocaleDateString('pt-BR', { 
                          month: 'short', 
                          year: 'numeric',
                          timeZone: 'UTC'
                        });
                      })()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 ml-6">
                    {formatDate(data.startDate)} - {formatDate(data.endDate)}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedPeriods.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <strong className="text-blue-600">{selectedPeriods.length}</strong> período(s) selecionado(s)
            {selectedPeriods.length > 1 && ' - Mostrando dados agregados'}
          </p>
        </div>
      )}
    </div>
  );
};
