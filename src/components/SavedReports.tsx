import { FileText, Download, Trash2, Calendar, RefreshCw } from 'lucide-react';
import type { SavedReport } from '../types';
import { downloadReportAsPDF } from '../utils/pdfGenerator';

interface SavedReportsProps {
  reports: SavedReport[];
  clientName: string;
  onDelete: (reportId: string) => void;
  onRegenerate: (month: string) => void;
}

export const SavedReports = ({ reports, clientName, onDelete, onRegenerate }: SavedReportsProps) => {

  const handleDownload = (report: SavedReport) => {
    downloadReportAsPDF(
      report.htmlContent,
      clientName,
      report.month,
      report.hasPaidTraffic,
      report.hasOrganicTraffic
    );
  };

  const formatMonth = (monthStr: string): string => {
    const [year, month] = monthStr.split('-');
    const date = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, 15));
    return date.toLocaleDateString('pt-BR', { 
      month: 'long', 
      year: 'numeric',
      timeZone: 'UTC'
    });
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-bold text-gray-800">Relatórios Salvos</h3>
        <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
          {reports.length}
        </span>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 font-medium mb-2">Nenhum relatório salvo ainda</p>
          <p className="text-sm text-gray-500">
            Gere um relatório usando o botão "Gerar Relatório" acima
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <span className="font-semibold text-gray-800">
                    {formatMonth(report.month)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Gerado em {formatDate(report.generatedAt)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {report.hasPaidTraffic && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                  Pago
                </span>
              )}
              {report.hasOrganicTraffic && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                  Orgânico
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleDownload(report)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
              <button
                onClick={() => onRegenerate(report.month)}
                className="px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                title="Regenerar relatório"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm('Deseja realmente excluir este relatório?')) {
                    onDelete(report.id);
                  }
                }}
                className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                title="Excluir relatório"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
};
