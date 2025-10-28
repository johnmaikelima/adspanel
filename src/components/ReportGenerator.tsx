import { useState } from 'react';
import { FileText, Download, Sparkles, Calendar, TrendingUp } from 'lucide-react';
import type { Client } from '../types';
import { generateAIReport } from '../services/openai';
import { downloadReportAsPDF } from '../utils/pdfGenerator';

interface ReportGeneratorProps {
  client: Client;
  onClose: () => void;
  onSaveReport: (report: { month: string; htmlContent: string; hasPaidTraffic: boolean; hasOrganicTraffic: boolean }) => void;
  initialMonth?: string;
}

export const ReportGenerator = ({ client, onClose, onSaveReport, initialMonth }: ReportGeneratorProps) => {
  const [selectedMonth, setSelectedMonth] = useState<string>(initialMonth || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [additionalContext, setAdditionalContext] = useState<string>('');

  // Obter todos os meses disponíveis (tráfego pago e orgânico)
  const availableMonths = Array.from(
    new Set([
      ...client.monthlyData.map(d => d.month),
      ...client.organicData.map(d => d.month)
    ])
  ).sort().reverse();

  const handleGenerateReport = async () => {
    if (!selectedMonth) return;

    setIsGenerating(true);
    
    try {
      // Encontrar o mês selecionado e os 3 anteriores
      const selectedIndex = availableMonths.indexOf(selectedMonth);
      const monthsToCompare = availableMonths.slice(selectedIndex, selectedIndex + 4);

      // Coletar dados dos meses
      const paidData = monthsToCompare
        .map(month => client.monthlyData.find(d => d.month === month))
        .filter((d): d is NonNullable<typeof d> => d !== undefined);

      const organicData = monthsToCompare
        .map(month => client.organicData.find(d => d.month === month))
        .filter((d): d is NonNullable<typeof d> => d !== undefined);

      // Preparar dados para a IA
      const dataForAI = {
        clientName: client.name,
        company: client.company,
        selectedMonth,
        paidTraffic: paidData,
        organicTraffic: organicData,
        monthsCompared: monthsToCompare,
        additionalContext: additionalContext.trim() || undefined
      };

      // Chamar API da OpenAI
      const generatedReport = await generateAIReport(dataForAI);
      setReport(generatedReport);

      // Salvar relatório automaticamente
      onSaveReport({
        month: selectedMonth,
        htmlContent: generatedReport,
        hasPaidTraffic: paidData.length > 0,
        hasOrganicTraffic: organicData.length > 0,
      });
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert('Erro ao gerar relatório. Verifique sua API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = () => {
    if (report) {
      // Verificar quais tipos de tráfego existem no período selecionado
      const selectedIndex = availableMonths.indexOf(selectedMonth);
      const monthsToCompare = availableMonths.slice(selectedIndex, selectedIndex + 4);
      
      const hasPaid = monthsToCompare.some(month => 
        client.monthlyData.find(d => d.month === month)
      );
      const hasOrganic = monthsToCompare.some(month => 
        client.organicData.find(d => d.month === month)
      );
      
      downloadReportAsPDF(report, client.name, selectedMonth, hasPaid, hasOrganic);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-purple-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Gerador de Relatórios</h2>
              <p className="text-sm text-gray-600">{client.name} - {client.company}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!report ? (
            <div className="space-y-6">
              {/* Seletor de Mês */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Selecione o Mês para Análise</h3>
                </div>
                
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                >
                  <option value="">Escolha um mês...</option>
                  {availableMonths.map(month => {
                    const [year, monthNum] = month.split('-');
                    const date = new Date(Date.UTC(parseInt(year), parseInt(monthNum) - 1, 15));
                    const monthName = date.toLocaleDateString('pt-BR', { 
                      month: 'long', 
                      year: 'numeric',
                      timeZone: 'UTC'
                    });
                    return (
                      <option key={month} value={month}>
                        {monthName}
                      </option>
                    );
                  })}
                </select>

                {selectedMonth && (
                  <p className="mt-3 text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    O relatório comparará este mês com até 3 meses anteriores disponíveis
                  </p>
                )}
              </div>

              {/* Campo de Contexto Adicional */}
              {selectedMonth && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Informações Adicionais (Opcional)</h3>
                  </div>
                  
                  <textarea
                    value={additionalContext}
                    onChange={(e) => setAdditionalContext(e.target.value)}
                    placeholder="Ex: Houve uma campanha especial em setembro que aumentou o tráfego. A queda em outubro foi devido à sazonalidade do setor. Investimos mais em palavras-chave de marca..."
                    className="w-full px-4 py-3 border-2 border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    rows={4}
                  />
                  
                  <p className="mt-3 text-sm text-gray-600">
                    💡 <strong>Dica:</strong> Adicione contexto sobre campanhas, sazonalidade, mudanças estratégicas ou qualquer informação que ajude a IA a gerar insights mais precisos
                  </p>
                </div>
              )}

              {/* Botão Gerar */}
              <button
                onClick={handleGenerateReport}
                disabled={!selectedMonth || isGenerating}
                className={`w-full py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-3 transition-all ${
                  !selectedMonth || isGenerating
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Gerando relatório com IA...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Gerar Relatório com IA
                  </>
                )}
              </button>

              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>💡 Como funciona:</strong><br />
                  1. Selecione o mês que deseja analisar<br />
                  2. A IA comparará com até 3 meses anteriores<br />
                  3. Será gerado um relatório profissional com insights, gráficos e análises<br />
                  4. Você poderá baixar o relatório em PDF para enviar ao cliente
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Botões de Ação */}
              <div className="flex gap-3">
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  <Download className="w-5 h-5" />
                  Baixar PDF
                </button>
                <button
                  onClick={() => setReport(null)}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                >
                  Gerar Novo Relatório
                </button>
              </div>

              {/* Relatório */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: report }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

