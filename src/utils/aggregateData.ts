import type { MonthlyData, OrganicTrafficData } from '../types';

export interface AggregatedData {
  clicks: number;
  impressions: number;
  conversions: number;
  totalSpent: number;
  costPerClick: number;
  conversionRate: number;
  periodCount: number;
  startDate: string;
  endDate: string;
}

export const aggregateMonthlyData = (dataList: MonthlyData[]): AggregatedData => {
  if (dataList.length === 0) {
    return {
      clicks: 0,
      impressions: 0,
      conversions: 0,
      totalSpent: 0,
      costPerClick: 0,
      conversionRate: 0,
      periodCount: 0,
      startDate: '',
      endDate: '',
    };
  }

  // Somar totais
  const totals = dataList.reduce(
    (acc, data) => ({
      clicks: acc.clicks + data.clicks,
      impressions: acc.impressions + data.impressions,
      conversions: acc.conversions + data.conversions,
      totalSpent: acc.totalSpent + data.totalSpent,
    }),
    { clicks: 0, impressions: 0, conversions: 0, totalSpent: 0 }
  );

  // Calcular médias ponderadas
  const costPerClick = totals.clicks > 0 ? totals.totalSpent / totals.clicks : 0;
  const conversionRate = totals.clicks > 0 ? (totals.conversions / totals.clicks) * 100 : 0;

  // Encontrar data inicial e final do período agregado
  const sortedByDate = [...dataList].sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
  const startDate = sortedByDate[0].startDate;
  const endDate = sortedByDate[sortedByDate.length - 1].endDate;

  return {
    clicks: totals.clicks,
    impressions: totals.impressions,
    conversions: totals.conversions,
    totalSpent: totals.totalSpent,
    costPerClick,
    conversionRate,
    periodCount: dataList.length,
    startDate,
    endDate,
  };
};

export interface AggregatedOrganicData {
  impressions: number;
  clicks: number;
  averagePosition: number;
  sessions?: number;
  users?: number;
  pageViews?: number;
  avgSessionDuration?: number;
  bounceRate?: number;
  organicConversions?: number;
  conversionRate?: number;
  periodCount: number;
  startDate: string;
  endDate: string;
}

export const aggregateOrganicData = (dataList: OrganicTrafficData[]): AggregatedOrganicData => {
  if (dataList.length === 0) {
    return {
      impressions: 0,
      clicks: 0,
      averagePosition: 0,
      periodCount: 0,
      startDate: '',
      endDate: '',
    };
  }

  // Somar totais obrigatórios
  const totals = dataList.reduce(
    (acc, data) => ({
      impressions: acc.impressions + data.impressions,
      clicks: acc.clicks + data.clicks,
      averagePosition: acc.averagePosition + data.averagePosition,
      sessions: acc.sessions + (data.sessions || 0),
      users: acc.users + (data.users || 0),
      pageViews: acc.pageViews + (data.pageViews || 0),
      avgSessionDuration: acc.avgSessionDuration + (data.avgSessionDuration || 0),
      bounceRate: acc.bounceRate + (data.bounceRate || 0),
      organicConversions: acc.organicConversions + (data.organicConversions || 0),
    }),
    { impressions: 0, clicks: 0, averagePosition: 0, sessions: 0, users: 0, pageViews: 0, avgSessionDuration: 0, bounceRate: 0, organicConversions: 0 }
  );

  // Calcular médias
  const averagePosition = totals.averagePosition / dataList.length;
  const avgSessionDuration = totals.avgSessionDuration / dataList.length;
  const bounceRate = totals.bounceRate / dataList.length;
  const conversionRate = totals.sessions > 0 ? (totals.organicConversions / totals.sessions) * 100 : 0;

  // Encontrar data inicial e final do período agregado
  const sortedByDate = [...dataList].sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
  const startDate = sortedByDate[0].startDate;
  const endDate = sortedByDate[sortedByDate.length - 1].endDate;

  return {
    impressions: totals.impressions,
    clicks: totals.clicks,
    averagePosition,
    sessions: totals.sessions > 0 ? totals.sessions : undefined,
    users: totals.users > 0 ? totals.users : undefined,
    pageViews: totals.pageViews > 0 ? totals.pageViews : undefined,
    avgSessionDuration: avgSessionDuration > 0 ? avgSessionDuration : undefined,
    bounceRate: bounceRate > 0 ? bounceRate : undefined,
    organicConversions: totals.organicConversions > 0 ? totals.organicConversions : undefined,
    conversionRate: conversionRate > 0 ? conversionRate : undefined,
    periodCount: dataList.length,
    startDate,
    endDate,
  };
};
