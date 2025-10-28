import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, MousePointer, Target, DollarSign, Eye, Plus, Calendar, Edit2, Trash2, Users, FileText } from 'lucide-react';
import type { Client, ComparisonData, MonthlyData, OrganicTrafficData } from '../types';
import { PeriodSelector } from './PeriodSelector';
import { TrafficTypeSelector, type TrafficType } from './TrafficTypeSelector';
import { SavedReports } from './SavedReports';
import { aggregateMonthlyData, aggregateOrganicData } from '../utils/aggregateData';

interface ClientDashboardProps {
  client: Client;
  onAddMonthlyData: () => void;
  onEditMonthlyData: (data: MonthlyData) => void;
  onDeleteMonthlyData: (dataId: string) => void;
  onAddOrganicData: () => void;
  onEditOrganicData: (data: OrganicTrafficData) => void;
  onDeleteOrganicData: (dataId: string) => void;
  onGenerateReport: (month?: string) => void;
  onDeleteReport: (reportId: string) => void;
}

export const ClientDashboard = ({ 
  client, 
  onAddMonthlyData, 
  onEditMonthlyData, 
  onDeleteMonthlyData,
  onAddOrganicData,
  onEditOrganicData,
  onDeleteOrganicData,
  onGenerateReport,
  onDeleteReport
}: ClientDashboardProps) => {
  const [trafficType, setTrafficType] = useState<TrafficType>('paid');
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);

  // Inicializar com o último período selecionado baseado no tipo de tráfego
  useEffect(() => {
    const data = trafficType === 'paid' ? client.monthlyData : client.organicData;
    if (data.length > 0 && selectedPeriods.length === 0) {
      setSelectedPeriods([data[0].id]);
    }
  }, [client.monthlyData, client.organicData, trafficType, selectedPeriods.length]);

  // Dados baseados no tipo de tráfego selecionado
  const isPaidTraffic = trafficType === 'paid';
  const currentData = isPaidTraffic ? client.monthlyData : client.organicData;
  const latestData = currentData[0];
  const previousData = currentData[1];

  // Se não há dados de nenhum tipo
  if (client.monthlyData.length === 0 && client.organicData.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{client.name}</h2>
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600 mb-4">Nenhum dado cadastrado</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={onAddMonthlyData}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <DollarSign className="w-5 h-5" />
                Adicionar Tráfego Pago
              </button>
              <button
                onClick={onAddOrganicData}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                <TrendingUp className="w-5 h-5" />
                Adicionar Tráfego Orgânico
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const calculateComparison = (): ComparisonData[] => {
    if (!previousData) return [];

    const metrics = [
      { key: 'clicks', label: 'Cliques' },
      { key: 'impressions', label: 'Impressões' },
      { key: 'conversions', label: 'Conversões' },
      { key: 'conversionRate', label: 'Taxa de Conversão' },
      { key: 'costPerClick', label: 'CPC' },
      { key: 'totalSpent', label: 'Valor Gasto' },
    ];

    return metrics.map(({ key, label }) => {
      const current = latestData[key as keyof typeof latestData] as number;
      const previous = previousData[key as keyof typeof previousData] as number;
      const change = current - previous;
      const changePercent = previous !== 0 ? (change / previous) * 100 : 0;

      return {
        metric: label,
        current,
        previous,
        change,
        changePercent,
      };
    });
  };

  const comparisons = calculateComparison();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const MetricCard = ({ 
    icon: Icon, 
    label, 
    value, 
    format = 'number',
    color = 'blue' 
  }: { 
    icon: any; 
    label: string; 
    value: number; 
    format?: 'number' | 'currency' | 'percent';
    color?: string;
  }) => {
    const formattedValue = 
      format === 'currency' ? formatCurrency(value) :
      format === 'percent' ? `${value.toFixed(2)}%` :
      formatNumber(value);

    return (
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderColor: `var(--${color}-600, #2563eb)` }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{label}</p>
            <p className="text-2xl font-bold text-gray-800">{formattedValue}</p>
          </div>
          <Icon className={`w-10 h-10 text-${color}-600`} />
        </div>
      </div>
    );
  };

  const ComparisonRow = ({ data }: { data: ComparisonData }) => {
    const isPositive = data.change > 0;
    const isNegative = data.change < 0;
    const isCostMetric = data.metric === 'CPC' || data.metric === 'Valor Gasto';
    
    // Para métricas de custo, negativo é bom
    const isGood = isCostMetric ? isNegative : isPositive;
    const isBad = isCostMetric ? isPositive : isNegative;

    return (
      <tr className="border-b border-gray-200 hover:bg-gray-50">
        <td className="py-3 px-4 font-medium text-gray-800">{data.metric}</td>
        <td className="py-3 px-4 text-right">
          {data.metric.includes('CPC') || data.metric.includes('Valor') 
            ? formatCurrency(data.current || 0)
            : data.metric.includes('Taxa')
            ? `${(data.current || 0).toFixed(2)}%`
            : formatNumber(data.current || 0)}
        </td>
        <td className="py-3 px-4 text-right text-gray-600">
          {data.metric.includes('CPC') || data.metric.includes('Valor') 
            ? formatCurrency(data.previous || 0)
            : data.metric.includes('Taxa')
            ? `${(data.previous || 0).toFixed(2)}%`
            : formatNumber(data.previous || 0)}
        </td>
        <td className="py-3 px-4 text-right">
          <div className="flex items-center justify-end gap-1">
            {isGood && <TrendingUp className="w-4 h-4 text-green-600" />}
            {isBad && <TrendingDown className="w-4 h-4 text-red-600" />}
            <span className={`font-medium ${isGood ? 'text-green-600' : isBad ? 'text-red-600' : 'text-gray-600'}`}>
              {data.changePercent > 0 ? '+' : ''}{(data.changePercent || 0).toFixed(1)}%
            </span>
          </div>
        </td>
      </tr>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { 
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  // Obter dados selecionados baseado no tipo de tráfego
  const selectedData = currentData.filter(d => selectedPeriods.includes(d.id));
  const isAggregated = selectedPeriods.length > 1;

  // Agregar dados baseado no tipo
  const aggregatedPaidData = isPaidTraffic ? aggregateMonthlyData(selectedData as any) : null;
  const aggregatedOrganicData = !isPaidTraffic ? aggregateOrganicData(selectedData as any) : null;

  // Dados para exibição (agregados ou individuais)
  const displayData = isAggregated 
    ? (isPaidTraffic ? aggregatedPaidData : aggregatedOrganicData)
    : (selectedData[0] || latestData);

  const latestMonth = latestData && 'month' in latestData
    ? new Date(latestData.month + '-01').toLocaleDateString('pt-BR', { 
        month: 'long', 
        year: 'numeric' 
      })
    : '';

  const displayPeriod = latestData && displayData
    ? isAggregated 
      ? `${formatDate(displayData.startDate)} até ${formatDate(displayData.endDate)}`
      : `${formatDate(displayData.startDate)} até ${formatDate(displayData.endDate)}`
    : '';

  const previousMonth = previousData && 'month' in previousData
    ? new Date(previousData.month + '-01').toLocaleDateString('pt-BR', { 
        month: 'long', 
        year: 'numeric' 
      })
    : '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{client.name}</h2>
            {client.company && <p className="text-gray-600">{client.company}</p>}
            {isAggregated && (
              <p className="text-sm text-purple-600 font-medium mt-1">
                📊 Dados Agregados ({selectedPeriods.length} períodos)
              </p>
            )}
            {displayPeriod && (
              <p className={`text-sm font-medium mt-1 ${isPaidTraffic ? 'text-blue-600' : 'text-green-600'}`}>
                📅 {displayPeriod}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => onGenerateReport()}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
            >
              <FileText className="w-4 h-4" />
              Gerar Relatório
            </button>
            <button
              onClick={isPaidTraffic ? onAddMonthlyData : onAddOrganicData}
              className={`flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-colors ${
                isPaidTraffic 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              <Plus className="w-4 h-4" />
              Adicionar {isPaidTraffic ? 'Tráfego Pago' : 'Tráfego Orgânico'}
            </button>
          </div>
        </div>
      </div>

      {/* Seletor de Tipo de Tráfego */}
      <TrafficTypeSelector
        selectedType={trafficType}
        onSelectType={(type) => {
          setTrafficType(type);
          setSelectedPeriods([]); // Limpar seleção ao trocar tipo
        }}
        paidCount={client.monthlyData.length}
        organicCount={client.organicData.length}
      />

      {/* Seletor de Período */}
      {latestData && (
        <PeriodSelector
          monthlyData={currentData}
          selectedPeriods={selectedPeriods}
          onSelectPeriods={setSelectedPeriods}
        />
      )}

      {/* Métricas Principais */}
      {displayData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isPaidTraffic ? (
            <>
              <MetricCard icon={MousePointer} label="Cliques" value={(displayData as any).clicks} color="blue" />
              <MetricCard icon={Eye} label="Impressões" value={(displayData as any).impressions} color="purple" />
              <MetricCard icon={Target} label="Conversões" value={(displayData as any).conversions} color="green" />
              <MetricCard icon={TrendingUp} label="Taxa de Conversão" value={displayData.conversionRate || 0} format="percent" color="orange" />
              <MetricCard icon={DollarSign} label="CPC" value={(displayData as any).costPerClick} format="currency" color="yellow" />
              <MetricCard icon={DollarSign} label="Valor Total Gasto" value={(displayData as any).totalSpent} format="currency" color="red" />
            </>
          ) : (
            <>
              <MetricCard icon={Eye} label="Impressões" value={(displayData as any).impressions} color="blue" />
              <MetricCard icon={MousePointer} label="Cliques" value={(displayData as any).clicks} color="green" />
              <MetricCard icon={Target} label="Posição Média" value={(displayData as any).averagePosition} format="number" color="orange" />
              {(displayData as any).sessions && <MetricCard icon={Users} label="Sessões" value={(displayData as any).sessions} color="purple" />}
              {(displayData as any).organicConversions && <MetricCard icon={TrendingUp} label="Conversões" value={(displayData as any).organicConversions} color="green" />}
              {(displayData as any).conversionRate && <MetricCard icon={TrendingUp} label="Taxa de Conversão" value={(displayData as any).conversionRate} format="percent" color="orange" />}
            </>
          )}
        </div>
      )}

      {/* Aviso de Dados Agregados */}
      {isAggregated && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-purple-900 mb-1">Visualizando Dados Agregados</h4>
              <p className="text-sm text-purple-700">
                As métricas exibidas representam a soma de <strong>{selectedPeriods.length} períodos</strong> selecionados. 
                O CPC e a Taxa de Conversão são calculados com base nos totais agregados.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Comparação com Mês Anterior */}
      {!isAggregated && previousData && comparisons.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Comparação com Mês Anterior
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Comparando {latestMonth} com {previousMonth}
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Métrica</th>
                  <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700">Atual</th>
                  <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700">Anterior</th>
                  <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700">Variação</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((comp, idx) => (
                  <ComparisonRow key={idx} data={comp} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Histórico */}
      {currentData.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Histórico - {isPaidTraffic ? 'Tráfego Pago' : 'Tráfego Orgânico'}
          </h3>
          <div className="space-y-2">
            {currentData.map((data) => (
              <div key={data.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <span className="font-medium text-gray-800">
                        {(() => {
                          // Usar UTC para evitar problemas de timezone
                          const [year, month] = data.month.split('-');
                          const date = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, 15));
                          return date.toLocaleDateString('pt-BR', { 
                            month: 'long', 
                            year: 'numeric',
                            timeZone: 'UTC'
                          });
                        })()}
                      </span>
                      <p className={`text-xs mt-0.5 ${isPaidTraffic ? 'text-blue-600' : 'text-green-600'}`}>
                        {formatDate(data.startDate)} até {formatDate(data.endDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex gap-6 text-sm">
                      {isPaidTraffic ? (
                        <>
                          <span className="text-gray-600">
                            <strong>{formatNumber((data as any).clicks)}</strong> cliques
                          </span>
                          <span className="text-gray-600">
                            <strong>{formatNumber((data as any).conversions)}</strong> conversões
                          </span>
                          <span className="text-gray-600">
                            <strong>{formatCurrency((data as any).totalSpent)}</strong> gastos
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-gray-600">
                            <strong>{formatNumber((data as any).impressions)}</strong> impressões
                          </span>
                          <span className="text-gray-600">
                            <strong>{formatNumber((data as any).clicks)}</strong> cliques
                          </span>
                          <span className="text-gray-600">
                            Pos. <strong>{((data as any).averagePosition || 0).toFixed(1)}</strong>
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => isPaidTraffic ? onEditMonthlyData(data as any) : onEditOrganicData(data as any)}
                        className={`p-2 rounded-lg transition-colors ${
                          isPaidTraffic 
                            ? 'text-blue-600 hover:bg-blue-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Tem certeza que deseja excluir estes dados?')) {
                            isPaidTraffic ? onDeleteMonthlyData(data.id) : onDeleteOrganicData(data.id);
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Relatórios Salvos */}
      <SavedReports
        reports={client.savedReports || []}
        clientName={client.name}
        onDelete={onDeleteReport}
        onRegenerate={(month) => onGenerateReport(month)}
      />
    </div>
  );
};
