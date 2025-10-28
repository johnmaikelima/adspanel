# Google Ads Manager - Sistema de Gerenciamento de Clientes

Sistema completo para gerenciar clientes do Google Ads com acompanhamento de desempenho mensal e comparação de métricas.

## 🚀 Funcionalidades

- ✅ **Cadastro de Clientes**: Adicione clientes com nome, email e empresa
- ✅ **Dois Tipos de Tráfego**:
  - **Tráfego Pago (Google Ads)**: Cliques, Impressões, Conversões, CPC, Valor Gasto
  - **Tráfego Orgânico (SEO)**: Sessões, Usuários, Visualizações, Taxa de Rejeição, Duração Média
- ✅ **Períodos Personalizados**: Defina data inicial e final para cada registro
- ✅ **Dashboard Interativo**: Visualize o desempenho de cada cliente
- ✅ **Seletor de Tipo de Tráfego**: Alterne entre tráfego pago e orgânico
- ✅ **Seleção de Período Flexível**: Analise um mês específico ou múltiplos períodos agregados
- ✅ **Comparação Mensal**: Compare automaticamente com o mês anterior
- ✅ **Dados Agregados**: Some métricas de múltiplos períodos para análise consolidada
- ✅ **Indicadores Visuais**: Setas e cores indicam melhorias ou quedas
- ✅ **Histórico Completo**: Veja todos os meses cadastrados de ambos os tipos
- ✅ **Edição e Exclusão**: Edite ou remova dados cadastrados
- ✅ **Persistência Local**: Dados salvos automaticamente no navegador

## 🛠️ Tecnologias

- **React 19** com TypeScript
- **TailwindCSS** para estilização
- **Lucide React** para ícones
- **Vite** como bundler
- **LocalStorage** para persistência de dados

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📖 Como Usar

### 1. Adicionar um Cliente

1. Clique no botão **"Novo Cliente"** na barra lateral
2. Preencha os dados:
   - Nome (obrigatório)
   - Email (obrigatório)
   - Empresa (opcional)
3. Clique em **"Salvar"**

### 2. Escolher Tipo de Tráfego

1. No dashboard do cliente, você verá o **Seletor de Tipo de Tráfego**
2. Escolha entre:
   - **Tráfego Pago** (azul) - Para campanhas do Google Ads
   - **Tráfego Orgânico** (verde) - Para resultados de SEO
3. O dashboard se adapta automaticamente mostrando as métricas relevantes

### 3. Adicionar Dados Mensais

**Para Tráfego Pago:**
1. Selecione "Tráfego Pago" no seletor
2. Clique em **"Adicionar Tráfego Pago"**
3. Preencha: Mês/Ano, Período, Cliques, Impressões, Conversões, CPC, Valor Gasto
4. Clique em **"Salvar Dados"**

**Para Tráfego Orgânico:**
1. Selecione "Tráfego Orgânico" no seletor
2. Clique em **"Adicionar Tráfego Orgânico"**
3. Preencha: Mês/Ano, Período, Sessões, Usuários, Visualizações, Duração Média, Taxa de Rejeição, Conversões
4. Opcionalmente adicione palavras-chave principais
5. Clique em **"Salvar Dados"**

💡 **Dica**: Você pode gerenciar ambos os tipos de tráfego para o mesmo cliente!

### 3. Editar ou Excluir Dados

1. No **histórico** de cada cliente, você verá botões de ação ao lado de cada período
2. Clique no **ícone de lápis** (✏️) para editar os dados
3. Clique no **ícone de lixeira** (🗑️) para excluir (com confirmação)
4. Ao editar, o formulário será preenchido com os dados existentes

### 4. Selecionar Período para Análise

1. Logo abaixo do botão "Adicionar Mês", você verá o **Seletor de Período**
2. Clique nos períodos que deseja analisar (pode selecionar múltiplos)
3. Use **"Selecionar Todos"** para ver dados agregados de todos os períodos
4. Use **"Desmarcar Todos"** para limpar a seleção

**Modos de Visualização:**
- **Período Único**: Mostra dados de um mês específico + comparação com mês anterior
- **Múltiplos Períodos**: Mostra dados agregados (soma) de todos os períodos selecionados

### 5. Visualizar Dashboard

- Selecione um cliente para ver:
  - **Métricas do período selecionado** em cards coloridos
  - **Comparação com mês anterior** (apenas para período único)
  - **Histórico completo** de todos os meses cadastrados com opções de edição
  - **Dados agregados** quando múltiplos períodos são selecionados

## 📊 Métricas Acompanhadas

### Tráfego Pago (Google Ads)

| Métrica | Descrição |
|---------|-----------|
| **Cliques** | Número total de cliques nos anúncios |
| **Impressões** | Quantas vezes os anúncios foram exibidos |
| **Conversões** | Ações desejadas completadas pelos usuários |
| **Taxa de Conversão** | Percentual de cliques que resultaram em conversão |
| **CPC** | Custo médio por clique |
| **Valor Total Gasto** | Investimento total no período |

### Tráfego Orgânico (SEO)

| Métrica | Descrição |
|---------|-----------|
| **Sessões** | Número total de sessões no site |
| **Usuários** | Usuários únicos que visitaram o site |
| **Visualizações de Página** | Total de páginas visualizadas |
| **Duração Média da Sessão** | Tempo médio que usuários passam no site (em segundos) |
| **Taxa de Rejeição** | Percentual de visitantes que saem sem interagir |
| **Conversões Orgânicas** | Conversões vindas de tráfego orgânico |
| **Taxa de Conversão** | Percentual de sessões que resultaram em conversão |
| **Palavras-chave** | Principais palavras-chave que trouxeram tráfego (opcional) |

## 🎨 Interface

- **Design Moderno**: Interface limpa e profissional
- **Responsivo**: Funciona em desktop, tablet e mobile
- **Cores Intuitivas**:
  - 🔵 Azul: Tráfego Pago / Google Ads
  - 🟢 Verde: Tráfego Orgânico / SEO
  - 🟣 Roxo: Dados Agregados
  - 🔴 Vermelho: Quedas ou exclusões
- **Feedback Visual**: Indicadores claros de tendências
- **Seletor Visual**: Alterne facilmente entre tipos de tráfego

## 💾 Armazenamento de Dados

Os dados são salvos automaticamente no **localStorage** do navegador:
- Não requer servidor ou banco de dados
- Dados persistem entre sessões
- Privacidade total (dados ficam apenas no seu navegador)

⚠️ **Atenção**: Limpar dados do navegador apagará todos os registros.

## 🔄 Comparação Mensal

O sistema compara automaticamente:
- Mês atual vs. mês anterior
- Mostra variação absoluta e percentual
- Indica se a mudança é positiva ou negativa
- Para custos, redução é considerada positiva

## 📱 Estrutura do Projeto

```
src/
├── components/
│   ├── ClientList.tsx          # Lista de clientes
│   ├── ClientForm.tsx          # Formulário de cadastro
│   ├── ClientDashboard.tsx     # Dashboard principal
│   └── MonthlyDataForm.tsx     # Formulário de dados mensais
├── hooks/
│   └── useClients.ts           # Hook de gerenciamento de dados
├── types.ts                    # Definições TypeScript
├── App.tsx                     # Componente principal
└── main.tsx                    # Entry point
```

## 🚀 Próximas Melhorias Sugeridas

- [ ] Exportar dados para Excel/CSV
- [ ] Gráficos de evolução temporal
- [ ] Metas e objetivos por cliente
- [ ] Notificações de performance
- [ ] Backup e restauração de dados
- [ ] Múltiplos usuários/autenticação
- [ ] Integração com API do Google Ads

## 📝 Licença

Este projeto é de uso livre para gerenciamento pessoal de clientes.

---

Desenvolvido com ❤️ para facilitar o gerenciamento de campanhas do Google Ads
