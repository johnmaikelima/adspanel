// Palavra-chave individual (tráfego pago)
export interface Keyword {
  id: string;
  name: string;
  clicks: number;
  impressions: number;
  cpc: number; // custo por clique
  conversions: number;
  cost: number; // custo total
}

// Palavra-chave orgânica
export interface OrganicKeyword {
  id: string;
  name: string;
  clicks: number;
  impressions: number;
}

// Dados de Tráfego Pago (Google Ads)
export interface PaidTrafficData {
  id: string;
  month: string; // formato: YYYY-MM
  startDate: string; // formato: YYYY-MM-DD
  endDate: string; // formato: YYYY-MM-DD
  clicks: number;
  conversions: number;
  costPerClick: number; // CPC
  totalSpent: number;
  impressions: number;
  conversionRate: number; // taxa de conversão em %
  keywords?: Keyword[]; // palavras-chave estruturadas
  topKeywords?: string; // desempenho das palavras-chave principais (deprecated - manter compatibilidade)
}

// Dados de Tráfego Orgânico (SEO)
export interface OrganicTrafficData {
  id: string;
  month: string; // formato: YYYY-MM
  startDate: string; // formato: YYYY-MM-DD
  endDate: string; // formato: YYYY-MM-DD
  impressions: number; // impressões totais (obrigatório)
  clicks: number; // cliques totais (obrigatório)
  averagePosition: number; // posição média (obrigatório)
  sessions?: number; // sessões (opcional)
  users?: number; // usuários únicos (opcional)
  pageViews?: number; // visualizações de página (opcional)
  avgSessionDuration?: number; // duração média da sessão em segundos (opcional)
  bounceRate?: number; // taxa de rejeição em % (opcional)
  organicConversions?: number; // conversões orgânicas (opcional)
  conversionRate?: number; // taxa de conversão em % (opcional)
  keywords?: OrganicKeyword[]; // palavras-chave estruturadas
  topKeywords?: string[]; // palavras-chave principais (deprecated - manter compatibilidade)
}

// Manter compatibilidade com código existente
export type MonthlyData = PaidTrafficData;

export interface SavedReport {
  id: string;
  month: string;
  generatedAt: string;
  htmlContent: string;
  hasPaidTraffic: boolean;
  hasOrganicTraffic: boolean;
}

// Informações de controle do cliente
export interface ClientControl {
  domain?: string;
  domainExpiry?: string; // Data de vencimento do domínio (YYYY-MM-DD)
  hostingExpiry?: string; // Data de vencimento da hospedagem (YYYY-MM-DD)
  annualFee?: number; // Valor anual pago pelo cliente
  notes?: string; // Observações adicionais
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
  monthlyData: PaidTrafficData[]; // Tráfego pago
  organicData: OrganicTrafficData[]; // Tráfego orgânico
  savedReports?: SavedReport[]; // Relatórios salvos
  control?: ClientControl; // Informações de controle
  createdAt: string;
}

export interface ComparisonData {
  metric: string;
  current: number;
  previous: number;
  change: number;
  changePercent: number;
}

// Ordem de Serviço
export interface ServiceOrderItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface ServiceOrder {
  id: string;
  number: string; // Número da OS (ex: OS-2025-001)
  clientId: string; // ID do cliente
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string; // Título/Assunto da OS
  description: string; // Descrição detalhada do serviço
  items: ServiceOrderItem[]; // Itens/Serviços
  subtotal: number;
  discount: number; // Desconto em valor
  discountPercent: number; // Desconto em %
  total: number;
  notes?: string; // Observações internas
  terms?: string; // Termos e condições
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  createdBy: string; // Usuário que criou
}
