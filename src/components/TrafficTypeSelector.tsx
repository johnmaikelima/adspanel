import { DollarSign, TrendingUp } from 'lucide-react';

export type TrafficType = 'paid' | 'organic';

interface TrafficTypeSelectorProps {
  selectedType: TrafficType;
  onSelectType: (type: TrafficType) => void;
  paidCount: number;
  organicCount: number;
}

export const TrafficTypeSelector = ({ 
  selectedType, 
  onSelectType, 
  paidCount, 
  organicCount 
}: TrafficTypeSelectorProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Tipo de Tráfego</h3>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onSelectType('paid')}
          className={`p-4 rounded-lg border-2 transition-all ${
            selectedType === 'paid'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className={`w-5 h-5 ${selectedType === 'paid' ? 'text-blue-600' : 'text-gray-500'}`} />
            <span className={`font-semibold ${selectedType === 'paid' ? 'text-blue-900' : 'text-gray-700'}`}>
              Tráfego Pago
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {paidCount} período{paidCount !== 1 ? 's' : ''} cadastrado{paidCount !== 1 ? 's' : ''}
          </p>
        </button>

        <button
          onClick={() => onSelectType('organic')}
          className={`p-4 rounded-lg border-2 transition-all ${
            selectedType === 'organic'
              ? 'border-green-600 bg-green-50'
              : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className={`w-5 h-5 ${selectedType === 'organic' ? 'text-green-600' : 'text-gray-500'}`} />
            <span className={`font-semibold ${selectedType === 'organic' ? 'text-green-900' : 'text-gray-700'}`}>
              Tráfego Orgânico
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {organicCount} período{organicCount !== 1 ? 's' : ''} cadastrado{organicCount !== 1 ? 's' : ''}
          </p>
        </button>
      </div>
    </div>
  );
};
