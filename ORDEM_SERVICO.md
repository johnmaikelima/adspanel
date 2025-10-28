# 📄 Guia de Uso - Ordens de Serviço

## 🎯 Funcionalidades

### ✅ Criar Ordem de Serviço
1. Acesse o menu **"Ordens de Serviço"**
2. Clique em **"Nova OS"**
3. Preencha os dados:
   - **Cliente:** Selecione um existente ou preencha manualmente
   - **Status:** Pendente, Em Andamento, Concluída, Cancelada
   - **Prioridade:** Baixa, Média, Alta, Urgente
   - **Título:** Assunto da OS
   - **Descrição:** Detalhes do serviço
   - **Itens:** Adicione os serviços/produtos
   - **Desconto:** Opcional (em %)
   - **Observações:** Notas internas (não aparecem no PDF)
   - **Termos:** Condições que aparecem no PDF
4. Clique em **"Criar Ordem de Serviço"**

### 📊 Dashboard
- **Estatísticas:** Total, Pendentes, Em Andamento, Concluídas, Canceladas, Receita
- **Filtros:** Filtre por status
- **Ações:** Visualizar, Editar, Exportar PDF, Excluir

### 🖨️ Imprimir/Gerar PDF

#### **Método 1: Impressão Direta**
1. Clique no ícone **👁️ (Visualizar)** na OS desejada
2. Clique em **"Imprimir"**
3. Na janela de impressão:
   - **Salvar como PDF:** Escolha "Salvar como PDF" no destino
   - **Imprimir:** Envie para impressora física

#### **Método 2: Exportar PDF**
1. Clique no ícone **📥 (Download)** na OS desejada
2. A janela de impressão abrirá automaticamente
3. Escolha **"Salvar como PDF"**
4. Escolha o local e salve

#### **Dicas de Impressão:**
- ✅ Use orientação **Retrato (Portrait)**
- ✅ Tamanho do papel: **A4**
- ✅ Margens: **Padrão** ou **1cm**
- ✅ Escala: **100%** (não ajustar)
- ✅ Cores: **Ativadas** (para ver badges coloridos)

### 🎨 Cabeçalho da OS

Toda OS impressa contém:
```
┌─────────────────────────────────────────────┐
│  [LOGO]  ALTUSTEC LTDA                      │
│          CNPJ: 27.177.744/0001-30           │
│                                             │
│                      ORDEM DE SERVIÇO       │
│                      OS-2025-001            │
│                      Data: 28/10/2025       │
└─────────────────────────────────────────────┘
```

### 📋 Estrutura da OS Impressa

1. **Cabeçalho:** Logo, CNPJ, Número da OS
2. **Dados do Cliente:** Nome, Email, Telefone, Endereço
3. **Descrição do Serviço:** Título e detalhes
4. **Itens/Serviços:** Tabela com descrição, quantidade, valor unitário, total
5. **Totais:** Subtotal, Desconto, Total
6. **Termos e Condições:** Condições personalizadas
7. **Assinaturas:** Espaço para empresa e cliente
8. **Rodapé:** Data/hora de geração

### 🔢 Numeração Automática

As OSs são numeradas automaticamente:
- Formato: `OS-ANO-NÚMERO`
- Exemplo: `OS-2025-001`, `OS-2025-002`, etc.
- Reinicia a cada ano

### 💾 Armazenamento

- Dados salvos localmente no navegador
- Sincronização automática
- Backup recomendado periodicamente

### ⚠️ Problemas Comuns

#### **PDF com páginas duplicadas/sobrepostas**
✅ **Resolvido!** O sistema agora:
- Evita quebras de página em seções importantes
- Mantém cabeçalhos de tabela em todas as páginas
- Remove duplicações

#### **Logo não aparece no PDF**
- Certifique-se que `logo.png` está na pasta raiz do projeto
- Tamanho recomendado: 200x200px

#### **Cores não aparecem no PDF**
- Ative a opção **"Gráficos de fundo"** na impressão
- Ou marque **"Imprimir cores de fundo"**

### 🎯 Fluxo de Trabalho Recomendado

1. **Cliente solicita serviço** → Criar OS com status "Pendente"
2. **Iniciar trabalho** → Mudar status para "Em Andamento"
3. **Concluir serviço** → Mudar status para "Concluída"
4. **Gerar PDF** → Enviar para cliente ou imprimir
5. **Arquivo** → Manter registro no sistema

### 📊 Relatórios

**Estatísticas disponíveis:**
- Total de OSs criadas
- OSs por status
- Receita total (OSs concluídas)
- Filtros por período (em breve)

### 🔐 Segurança

- Dados armazenados localmente
- Acesso protegido por login
- Backup recomendado do arquivo `adspanel_service_orders` no localStorage

---

## 💡 Dicas Profissionais

1. **Personalize os termos:** Adapte os termos e condições para seu negócio
2. **Use prioridades:** Organize o trabalho por urgência
3. **Adicione observações:** Use notas internas para controle
4. **Revise antes de imprimir:** Sempre visualize antes de gerar PDF
5. **Mantenha atualizado:** Atualize o status conforme o andamento

---

**Sistema desenvolvido para ALTUSTEC LTDA** 🚀
