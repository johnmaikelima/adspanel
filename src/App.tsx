import { useState } from 'react';
import { BarChart3, Settings, LogOut, FileText } from 'lucide-react';
import { useClients } from './hooks/useClients';
import { useServiceOrders } from './hooks/useServiceOrders';
import { useAuth } from './contexts/AuthContext';
import { ClientList } from './components/ClientList';
import { ClientForm } from './components/ClientForm';
import { ClientDashboard } from './components/ClientDashboard';
import { MonthlyDataForm } from './components/MonthlyDataForm';
import { OrganicDataForm } from './components/OrganicDataForm';
import { DataManager } from './components/DataManager';
import { ReportGenerator } from './components/ReportGenerator';
import { ControlDashboard } from './components/ControlDashboard';
import { ClientControlForm } from './components/ClientControlForm';
import { ServiceOrderDashboard } from './components/ServiceOrderDashboard';
import { ServiceOrderForm } from './components/ServiceOrderForm';
import { ServiceOrderView } from './components/ServiceOrderView';
import { Login } from './components/Login';
import type { Client, MonthlyData, OrganicTrafficData, ClientControl, ServiceOrder } from './types';

function App() {
  const { isAuthenticated, username, logout } = useAuth();
  const {
    clients,
    addClient,
    addMonthlyData,
    updateMonthlyData,
    deleteMonthlyData,
    addOrganicData,
    updateOrganicData,
    deleteOrganicData,
    importClients,
    saveReport,
    deleteReport,
    updateClientControl,
    renewService,
  } = useClients();

  const {
    serviceOrders,
    addServiceOrder,
    updateServiceOrder,
    deleteServiceOrder,
  } = useServiceOrders();

  // Se não estiver autenticado, mostrar tela de login
  if (!isAuthenticated) {
    return <Login />;
  }

  const [currentView, setCurrentView] = useState<'dashboard' | 'control' | 'service-orders'>('dashboard');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientForm, setShowClientForm] = useState(false);
  const [showMonthlyDataForm, setShowMonthlyDataForm] = useState(false);
  const [showOrganicDataForm, setShowOrganicDataForm] = useState(false);
  const [showReportGenerator, setShowReportGenerator] = useState(false);
  const [showControlForm, setShowControlForm] = useState(false);
  const [editingControlClient, setEditingControlClient] = useState<Client | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>(undefined);
  const [editingMonthlyData, setEditingMonthlyData] = useState<MonthlyData | null>(null);
  const [editingOrganicData, setEditingOrganicData] = useState<OrganicTrafficData | null>(null);
  
  // Estados para Ordens de Serviço
  const [showServiceOrderForm, setShowServiceOrderForm] = useState(false);
  const [editingServiceOrder, setEditingServiceOrder] = useState<ServiceOrder | null>(null);
  const [viewingServiceOrder, setViewingServiceOrder] = useState<ServiceOrder | null>(null);

  const handleAddClient = (data: { name: string; email: string; company?: string }) => {
    const newClient = addClient(data);
    setShowClientForm(false);
    setSelectedClient(newClient);
  };

  const handleAddMonthlyData = (data: any) => {
    if (selectedClient) {
      if (editingMonthlyData) {
        // Modo de edição
        updateMonthlyData(selectedClient.id, editingMonthlyData.id, data);
        setEditingMonthlyData(null);
      } else {
        // Modo de adição
        addMonthlyData(selectedClient.id, data);
      }
      setShowMonthlyDataForm(false);
    }
  };

  const handleEditMonthlyData = (data: MonthlyData) => {
    setEditingMonthlyData(data);
    setShowMonthlyDataForm(true);
  };

  const handleDeleteMonthlyData = (dataId: string) => {
    if (selectedClient) {
      deleteMonthlyData(selectedClient.id, dataId);
    }
  };

  // Handlers para dados orgânicos
  const handleAddOrganicData = (data: any) => {
    try {
      if (selectedClient) {
        if (editingOrganicData) {
          // Modo de edição
          updateOrganicData(selectedClient.id, editingOrganicData.id, data);
          setEditingOrganicData(null);
        } else {
          // Modo de adição
          addOrganicData(selectedClient.id, data);
        }
        setShowOrganicDataForm(false);
      }
    } catch (error) {
      console.error('Erro ao adicionar dados orgânicos:', error);
      alert('Erro ao salvar dados: ' + (error as Error).message);
    }
  };

  const handleEditOrganicData = (data: OrganicTrafficData) => {
    setEditingOrganicData(data);
    setShowOrganicDataForm(true);
  };

  const handleDeleteOrganicData = (dataId: string) => {
    if (selectedClient) {
      deleteOrganicData(selectedClient.id, dataId);
    }
  };

  // Handlers para Ordens de Serviço
  const handleSaveServiceOrder = (orderData: Omit<ServiceOrder, 'id' | 'number' | 'createdAt' | 'updatedAt'>) => {
    if (editingServiceOrder) {
      updateServiceOrder(editingServiceOrder.id, orderData);
      setEditingServiceOrder(null);
    } else {
      addServiceOrder(orderData);
    }
    setShowServiceOrderForm(false);
  };

  const handleEditServiceOrder = (order: ServiceOrder) => {
    setEditingServiceOrder(order);
    setShowServiceOrderForm(true);
  };

  const handleViewServiceOrder = (order: ServiceOrder) => {
    setViewingServiceOrder(order);
  };

  const handleExportPDF = (order: ServiceOrder) => {
    // Implementar exportação para PDF
    setViewingServiceOrder(order);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  // Atualizar o cliente selecionado quando os dados mudarem
  const currentClient = selectedClient 
    ? clients.find(c => c.id === selectedClient.id) || null
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Google Ads Manager</h1>
                <p className="text-sm text-gray-600">Gerencie seus clientes e acompanhe o desempenho</p>
              </div>
            </div>
            
            {/* Menu de Navegação */}
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('control')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'control'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Settings className="w-4 h-4" />
                Controle de Clientes
              </button>
              <button
                onClick={() => setCurrentView('service-orders')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'service-orders'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                Ordens de Serviço
              </button>
              </div>
              
              {/* Usuário e Logout */}
              <div className="flex items-center gap-3 border-l border-gray-300 pl-4">
                <span className="text-sm text-gray-600">
                  Olá, <strong>{username}</strong>
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Sair"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentView === 'service-orders' ? (
          /* Visualização de Ordens de Serviço */
          <ServiceOrderDashboard
            serviceOrders={serviceOrders}
            onCreateNew={() => {
              setEditingServiceOrder(null);
              setShowServiceOrderForm(true);
            }}
            onEdit={handleEditServiceOrder}
            onDelete={deleteServiceOrder}
            onView={handleViewServiceOrder}
            onExportPDF={handleExportPDF}
          />
        ) : currentView === 'control' ? (
          /* Visualização de Controle de Clientes */
          <ControlDashboard
            clients={clients}
            onEditControl={(client) => {
              setEditingControlClient(client);
              setShowControlForm(true);
            }}
            onRenew={(client, type, months) => {
              renewService(client.id, type, months);
            }}
            onAddClient={() => setShowClientForm(true)}
          />
        ) : (
          /* Visualização Dashboard Normal */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar - Lista de Clientes */}
            <div className="lg:col-span-1">
              <ClientList
                clients={clients}
                selectedClient={currentClient}
                onSelectClient={setSelectedClient}
                onAddClient={() => setShowClientForm(true)}
              />
            </div>

            {/* Dashboard - Detalhes do Cliente */}
            <div className="lg:col-span-2 space-y-6">
              {currentClient ? (
                <ClientDashboard
                  client={currentClient}
                  onAddMonthlyData={() => {
                    setEditingMonthlyData(null);
                    setShowMonthlyDataForm(true);
                  }}
                  onEditMonthlyData={handleEditMonthlyData}
                  onDeleteMonthlyData={handleDeleteMonthlyData}
                  onAddOrganicData={() => {
                    setEditingOrganicData(null);
                    setShowOrganicDataForm(true);
                  }}
                  onEditOrganicData={handleEditOrganicData}
                  onDeleteOrganicData={handleDeleteOrganicData}
                  onGenerateReport={(month) => {
                    setSelectedMonth(month);
                    setShowReportGenerator(true);
                  }}
                  onDeleteReport={(reportId) => deleteReport(currentClient.id, reportId)}
                />
              ) : (
                <>
                  <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <BarChart3 className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                    <h2 className="text-xl font-semibold text-gray-600 mb-2">
                      Selecione um cliente
                    </h2>
                    <p className="text-gray-500">
                      Escolha um cliente da lista para ver o resumo de desempenho
                    </p>
                  </div>
                  <DataManager clients={clients} onImport={importClients} />
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {showClientForm && (
        <ClientForm
          onSubmit={handleAddClient}
          onCancel={() => setShowClientForm(false)}
        />
      )}

      {showMonthlyDataForm && currentClient && (
        <MonthlyDataForm
          clientName={currentClient.name}
          onSubmit={handleAddMonthlyData}
          onCancel={() => {
            setShowMonthlyDataForm(false);
            setEditingMonthlyData(null);
          }}
          editData={editingMonthlyData || undefined}
        />
      )}

      {showOrganicDataForm && currentClient && (
        <OrganicDataForm
          clientName={currentClient.name}
          onSubmit={handleAddOrganicData}
          onCancel={() => {
            setShowOrganicDataForm(false);
            setEditingOrganicData(null);
          }}
          editData={editingOrganicData || undefined}
        />
      )}

      {showReportGenerator && currentClient && (
        <ReportGenerator
          client={currentClient}
          onClose={() => {
            setShowReportGenerator(false);
            setSelectedMonth(undefined);
          }}
          onSaveReport={(report) => saveReport(currentClient.id, report)}
          initialMonth={selectedMonth}
        />
      )}

      {showControlForm && editingControlClient && (
        <ClientControlForm
          clientName={editingControlClient.name}
          control={editingControlClient.control}
          onSubmit={(control: ClientControl) => {
            updateClientControl(editingControlClient.id, control);
            setShowControlForm(false);
            setEditingControlClient(null);
          }}
          onCancel={() => {
            setShowControlForm(false);
            setEditingControlClient(null);
          }}
        />
      )}

      {/* Modais de Ordem de Serviço */}
      {showServiceOrderForm && (
        <ServiceOrderForm
          order={editingServiceOrder || undefined}
          clients={clients}
          onSave={handleSaveServiceOrder}
          onClose={() => {
            setShowServiceOrderForm(false);
            setEditingServiceOrder(null);
          }}
          currentUser={username || 'Admin'}
        />
      )}

      {viewingServiceOrder && (
        <ServiceOrderView
          order={viewingServiceOrder}
          onClose={() => setViewingServiceOrder(null)}
          onExportPDF={() => handleExportPDF(viewingServiceOrder)}
        />
      )}
    </div>
  );
}

export default App;
