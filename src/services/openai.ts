import type { MonthlyData, OrganicTrafficData } from '../types';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

interface ReportData {
  clientName: string;
  company?: string;
  selectedMonth: string;
  paidTraffic: MonthlyData[];
  organicTraffic: OrganicTrafficData[];
  monthsCompared: string[];
  additionalContext?: string;
}

export async function generateAIReport(data: ReportData): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('API Key da OpenAI não configurada');
  }

  // Formatar dados para análise
  const paidSummary = data.paidTraffic.map((d) => {
    const monthName = formatMonth(d.month);
    
    let keywordsInfo = '';
    if (d.keywords && d.keywords.length > 0) {
      keywordsInfo = '\n- Principais Palavras-Chave (amostra das mais relevantes):\n' + d.keywords.map(kw => {
        const ctr = kw.impressions > 0 ? ((kw.clicks / kw.impressions) * 100).toFixed(2) : '0.00';
        return `  • "${kw.name}": ${kw.clicks} cliques, ${kw.impressions} impressões, CPC R$ ${kw.cpc.toFixed(2)}, ${kw.conversions} conversões, Custo R$ ${kw.cost.toFixed(2)}, CTR ${ctr}%`;
      }).join('\n');
    } else if (d.topKeywords) {
      keywordsInfo = `\n- Principais Palavras-Chave:\n${d.topKeywords}`;
    }
    
    return `
**${monthName}** (${d.startDate} a ${d.endDate}):
- Cliques: ${d.clicks.toLocaleString('pt-BR')}
- Impressões: ${d.impressions.toLocaleString('pt-BR')}
- Conversões: ${d.conversions}
- CPC: R$ ${d.costPerClick.toFixed(2)}
- Valor Gasto: R$ ${d.totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- Taxa de Conversão: ${d.conversionRate.toFixed(2)}%${keywordsInfo}
`;
  }).join('\n');

  const organicSummary = data.organicTraffic.map((d) => {
    const monthName = formatMonth(d.month);
    
    let keywordsInfo = '';
    if (d.keywords && d.keywords.length > 0) {
      keywordsInfo = '\n- Principais Palavras-Chave (amostra das mais relevantes):\n' + d.keywords.map(kw => {
        const ctr = kw.impressions > 0 ? ((kw.clicks / kw.impressions) * 100).toFixed(2) : '0.00';
        return `  • "${kw.name}": ${kw.clicks} cliques, ${kw.impressions} impressões, CTR ${ctr}%`;
      }).join('\n');
    }
    
    return `
**${monthName}** (${d.startDate} a ${d.endDate}):
- Impressões: ${d.impressions.toLocaleString('pt-BR')}
- Cliques: ${d.clicks.toLocaleString('pt-BR')}
- Posição Média: ${d.averagePosition.toFixed(1)}
${d.sessions ? `- Sessões: ${d.sessions.toLocaleString('pt-BR')}` : ''}
${d.organicConversions ? `- Conversões: ${d.organicConversions}` : ''}
${d.conversionRate ? `- Taxa de Conversão: ${d.conversionRate.toFixed(2)}%` : ''}${keywordsInfo}
`;
  }).join('\n');

  const prompt = `Você é um especialista em marketing digital e análise de dados. Gere um relatório profissional e detalhado para apresentar ao cliente.

**INFORMAÇÕES DO CLIENTE:**
- Nome: ${data.clientName}
${data.company ? `- Empresa: ${data.company}` : ''}
- Mês Principal de Análise: ${formatMonth(data.selectedMonth)}

**DADOS DE TRÁFEGO PAGO (Google Ads):**
${paidSummary || 'Nenhum dado disponível'}

**DADOS DE TRÁFEGO ORGÂNICO (SEO):**
${organicSummary || 'Nenhum dado disponível'}

${data.additionalContext ? `
**CONTEXTO ADICIONAL FORNECIDO:**
${data.additionalContext}

**IMPORTANTE:** Use estas informações adicionais para contextualizar as análises, explicar variações nos dados e fornecer insights mais precisos e relevantes.
` : ''}

**INSTRUÇÕES PARA O RELATÓRIO:**

1. **Título e Introdução**: Crie um título profissional e uma introdução executiva resumindo os principais destaques do período.

2. **Análise de Tráfego Pago**: 
   - Compare o desempenho entre os meses
   - Identifique tendências (crescimento ou queda)
   - Analise eficiência do investimento (CPC, conversões, ROI)
   - Se houver dados de palavras-chave (principais termos, não todas), analise o desempenho individual e sugira otimizações
   - Use as palavras-chave como amostra representativa do desempenho geral
   - Destaque pontos positivos e áreas de melhoria

3. **Análise de Tráfego Orgânico**:
   - Compare impressões e cliques entre os meses
   - Analise evolução da posição média
   - Se houver dados de palavras-chave (principais termos, não todas), analise o desempenho individual
   - Use as palavras-chave como amostra representativa do desempenho orgânico geral
   - Identifique tendências de crescimento orgânico
   - Relacione com o tráfego pago quando relevante

4. **Insights e Recomendações**:
   - Forneça 3-5 insights estratégicos baseados nos dados
   - Sugira ações concretas para melhorar os resultados
   - Identifique oportunidades de otimização

5. **Conclusão**: Resumo executivo com próximos passos sugeridos

**FORMATO DO RELATÓRIO:**
- Use HTML bem formatado com tags semânticas
- Inclua títulos (h2, h3), parágrafos (p), listas (ul, li)
- NÃO use h1 (será adicionado automaticamente no cabeçalho)
- Adicione emojis estrategicamente para melhorar a leitura (📊 📈 📉 💡 ✅ ⚠️ 🎯)
- Formate números com separadores de milhares
- Use tabelas HTML quando apropriado para comparações
- Para destacar seções importantes, use divs com classes: 'info-box', 'warning-box', 'success-box'
- Mantenha tom profissional mas acessível
- Use <strong> para negrito e <em> para itálico

**IMPORTANTE:** 
- Os títulos h2 "Análise de Tráfego Pago" e "Análise de Tráfego Orgânico" já terão estilo automático (fundo azul, texto branco)
- Outros h2 também terão este estilo
- Use h3 para subtítulos dentro das seções
- NÃO inclua textos introdutórios como "Aqui está o relatório" ou "Considerações"
- NÃO inclua blocos de código markdown
- Retorne APENAS o HTML puro do conteúdo do relatório, sem explicações adicionais

Gere o relatório completo em HTML agora:`;

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em marketing digital e análise de dados, especializado em Google Ads e SEO. Gere relatórios profissionais, detalhados e acionáveis em HTML.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Erro da API: ${error.error?.message || 'Erro desconhecido'}`);
    }

    const result = await response.json();
    const reportHTML = result.choices[0].message.content;

    return reportHTML;
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    throw error;
  }
}

function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split('-');
  const date = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, 15));
  return date.toLocaleDateString('pt-BR', { 
    month: 'long', 
    year: 'numeric',
    timeZone: 'UTC'
  });
}
