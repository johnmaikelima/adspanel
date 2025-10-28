import { X, Printer, Download } from 'lucide-react';
import type { ServiceOrder } from '../types';

interface ServiceOrderViewProps {
  order: ServiceOrder;
  onClose: () => void;
  onExportPDF: () => void;
}

export const ServiceOrderView = ({ order, onClose, onExportPDF }: ServiceOrderViewProps) => {
  const handlePrint = () => {
    window.print();
  };

  const getStatusLabel = (status: ServiceOrder['status']) => {
    const labels = {
      pending: 'Pendente',
      in_progress: 'Em Andamento',
      completed: 'Concluída',
      cancelled: 'Cancelada',
    };
    return labels[status];
  };

  return (
    <>
      {/* Modal - Não imprime */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 print:hidden">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Visualizar Ordem de Serviço</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50"
              >
                <Printer className="w-4 h-4" />
                Imprimir
              </button>
              <button
                onClick={onExportPDF}
                className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
              <button onClick={onClose} className="text-white hover:text-gray-200">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Preview do conteúdo */}
          <div className="p-8">
            <ServiceOrderContent order={order} getStatusLabel={getStatusLabel} />
          </div>
        </div>
      </div>

      {/* Conteúdo para impressão - Escondido na tela */}
      <div className="hidden print:block" id="print-only-content">
        <ServiceOrderContent order={order} getStatusLabel={getStatusLabel} />
      </div>

      {/* Estilos para impressão */}
      <style>{`
        @media print {
          /* Esconder TUDO primeiro */
          body * {
            visibility: hidden !important;
          }
          
          /* Mostrar APENAS o conteúdo de impressão */
          #print-only-content,
          #print-only-content * {
            visibility: visible !important;
          }
          
          /* Posicionar o conteúdo no topo da página */
          #print-only-content {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
          }
          
          /* Configurações de cores */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Configurações de página */
          @page {
            size: A4;
            margin: 1cm;
          }
          
          /* Evitar quebras de página em elementos importantes */
          h1, h2, h3, h4, h5, h6 {
            page-break-after: avoid;
            page-break-inside: avoid;
          }
          
          table {
            page-break-inside: auto;
          }
          
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          
          thead {
            display: table-header-group;
          }
          
          .no-break {
            page-break-inside: avoid;
          }
          
          /* Remover sombras e efeitos */
          * {
            box-shadow: none !important;
            text-shadow: none !important;
          }
        }
      `}</style>
    </>
  );
};

// Componente separado para o conteúdo da OS
const ServiceOrderContent = ({ order, getStatusLabel }: { order: ServiceOrder; getStatusLabel: (status: ServiceOrder['status']) => string }) => (
  <div>
    {/* Cabeçalho da Empresa */}
    <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-gray-300 no-break">
      <div className="flex items-center gap-4">
        <img 
          src="/logo.png" 
          alt="ALTUSTEC Logo" 
          className="w-24 h-24 object-contain"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">ALTUSTEC LTDA</h1>
          <p className="text-gray-600">CNPJ: 27.177.744/0001-30</p>
        </div>
      </div>
      <div className="text-right">
        <h2 className="text-xl font-bold text-blue-600">ORDEM DE SERVIÇO</h2>
        <p className="text-lg font-semibold text-gray-800">{order.number}</p>
        <p className="text-sm text-gray-600">
          Data: {new Date(order.createdAt).toLocaleDateString('pt-BR')}
        </p>
        <p className="text-sm">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            order.status === 'completed' ? 'bg-green-100 text-green-800' :
            order.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {getStatusLabel(order.status)}
          </span>
        </p>
      </div>
    </div>

    {/* Dados do Cliente */}
    <div className="mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-3 pb-2 border-b border-gray-300">
        DADOS DO CLIENTE
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Nome:</p>
          <p className="font-semibold text-gray-800">{order.clientName}</p>
        </div>
        {order.clientEmail && (
          <div>
            <p className="text-sm text-gray-600">Email:</p>
            <p className="font-semibold text-gray-800">{order.clientEmail}</p>
          </div>
        )}
        {order.clientPhone && (
          <div>
            <p className="text-sm text-gray-600">Telefone:</p>
            <p className="font-semibold text-gray-800">{order.clientPhone}</p>
          </div>
        )}
        {order.clientAddress && (
          <div className="col-span-2">
            <p className="text-sm text-gray-600">Endereço:</p>
            <p className="font-semibold text-gray-800">{order.clientAddress}</p>
          </div>
        )}
      </div>
    </div>

    {/* Descrição do Serviço */}
    <div className="mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-3 pb-2 border-b border-gray-300">
        DESCRIÇÃO DO SERVIÇO
      </h3>
      <div className="mb-3">
        <p className="text-sm text-gray-600">Título:</p>
        <p className="font-semibold text-gray-800 text-lg">{order.title}</p>
      </div>
      {order.description && (
        <div>
          <p className="text-sm text-gray-600">Detalhes:</p>
          <p className="text-gray-800 whitespace-pre-wrap">{order.description}</p>
        </div>
      )}
    </div>

    {/* Itens/Serviços */}
    <div className="mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-3 pb-2 border-b border-gray-300">
        ITENS/SERVIÇOS
      </h3>
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Descrição</th>
            <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Qtd</th>
            <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Valor Unit.</th>
            <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {order.items.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-3 text-gray-800">{item.description}</td>
              <td className="px-4 py-3 text-center text-gray-800">{item.quantity}</td>
              <td className="px-4 py-3 text-right text-gray-800">
                R$ {item.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
              <td className="px-4 py-3 text-right font-semibold text-gray-800">
                R$ {(item.quantity * item.unitPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Totais */}
    <div className="mb-6 flex justify-end no-break">
      <div className="w-80 space-y-2">
        <div className="flex justify-between py-2 border-b border-gray-200">
          <span className="text-gray-700">Subtotal:</span>
          <span className="font-semibold text-gray-800">
            R$ {order.subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-700">Desconto ({order.discountPercent}%):</span>
            <span className="font-semibold text-red-600">
              - R$ {order.discount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}
        <div className="flex justify-between py-3 border-t-2 border-gray-300">
          <span className="text-lg font-bold text-gray-800">TOTAL:</span>
          <span className="text-2xl font-bold text-blue-600">
            R$ {order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>

    {/* Termos e Condições */}
    {order.terms && (
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3 pb-2 border-b border-gray-300">
          TERMOS E CONDIÇÕES
        </h3>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{order.terms}</p>
      </div>
    )}

    {/* Assinaturas */}
    <div className="mt-12 pt-8 border-t-2 border-gray-300 no-break">
      <div className="grid grid-cols-2 gap-8">
        <div className="text-center">
          <div className="border-t-2 border-gray-400 pt-2 mt-16">
            <p className="font-semibold text-gray-800">ALTUSTEC LTDA</p>
            <p className="text-sm text-gray-600">Prestador de Serviço</p>
          </div>
        </div>
        <div className="text-center">
          <div className="border-t-2 border-gray-400 pt-2 mt-16">
            <p className="font-semibold text-gray-800">{order.clientName}</p>
            <p className="text-sm text-gray-600">Cliente</p>
          </div>
        </div>
      </div>
    </div>

    {/* Rodapé */}
    <div className="mt-8 text-center text-xs text-gray-500">
      <p>Documento gerado em {new Date().toLocaleString('pt-BR')}</p>
    </div>
  </div>
);
