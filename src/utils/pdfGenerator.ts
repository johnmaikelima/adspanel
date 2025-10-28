export async function downloadReportAsPDF(
  htmlContent: string, 
  clientName: string, 
  month: string,
  hasPaidTraffic: boolean = false,
  hasOrganicTraffic: boolean = false
) {
  // Criar uma janela temporária para impressão
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Por favor, permita pop-ups para baixar o PDF');
    return;
  }

  // Formatar o mês para o nome do arquivo
  const [year, monthNum] = month.split('-');
  const date = new Date(Date.UTC(parseInt(year), parseInt(monthNum) - 1, 15));
  const monthName = date.toLocaleDateString('pt-BR', { 
    month: 'long', 
    year: 'numeric',
    timeZone: 'UTC'
  }).replace(/ /g, '-');

  // Limpar textos desnecessários da IA
  let cleanedContent = htmlContent
    // Remover textos introdutórios comuns
    .replace(/Aqui está o relatório.*?:/gi, '')
    .replace(/```html/gi, '')
    .replace(/```/g, '')
    .replace(/### Considerações:.*$/s, '')
    .replace(/Sinta-se à vontade.*$/s, '')
    // Remover espaços extras
    .trim();

  // Processar HTML para adicionar estilos inline nos h2
  const processedContent = cleanedContent.replace(
    /<h2>/g,
    '<h2 style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; font-size: 22px; margin-top: 30px; margin-bottom: 15px; padding: 15px 20px; border-radius: 8px; font-weight: 600; box-shadow: 0 4px 6px rgba(0,0,0,0.1); -webkit-print-color-adjust: exact; print-color-adjust: exact;">'
  );

  // HTML completo com estilos para impressão
  const fullHTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório - ${clientName} - ${monthName}</title>
  <style>
    @page {
      size: A4;
      margin: 0;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background: white;
    }
    
    .report-header {
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
      margin-bottom: 30px;
    }
    
    .report-header h1 {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 15px;
      letter-spacing: 1px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }
    
    .report-header .subtitle {
      font-size: 20px;
      font-weight: 500;
      margin-bottom: 8px;
      opacity: 0.95;
    }
    
    .report-header .month {
      font-size: 18px;
      font-weight: 400;
      opacity: 0.9;
    }
    
    .content-wrapper {
      padding: 0 30px 30px 30px;
    }
    
    h1 {
      color: #1e40af;
      font-size: 28px;
      margin-bottom: 10px;
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 10px;
    }
    
    h2 {
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
      color: white;
      font-size: 22px;
      margin-top: 30px;
      margin-bottom: 15px;
      padding: 15px 20px;
      border-radius: 8px;
      font-weight: 600;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    
    h3 {
      color: #374151;
      font-size: 18px;
      margin-top: 20px;
      margin-bottom: 10px;
      padding-left: 10px;
      border-left: 4px solid #3b82f6;
    }
    
    p {
      margin-bottom: 12px;
      text-align: justify;
    }
    
    ul, ol {
      margin-left: 25px;
      margin-bottom: 15px;
    }
    
    li {
      margin-bottom: 8px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 14px;
    }
    
    th, td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    
    th {
      background-color: #3b82f6;
      color: white;
      font-weight: bold;
    }
    
    tr:nth-child(even) {
      background-color: #f3f4f6;
    }
    
    strong {
      color: #1f2937;
      font-weight: 600;
    }
    
    .highlight {
      background-color: #fef3c7;
      padding: 2px 6px;
      border-radius: 3px;
    }
    
    .positive {
      color: #059669;
      font-weight: bold;
    }
    
    .negative {
      color: #dc2626;
      font-weight: bold;
    }
    
    .info-box {
      background-color: #eff6ff;
      border-left: 4px solid #3b82f6;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    
    .warning-box {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    
    .success-box {
      background-color: #d1fae5;
      border-left: 4px solid #10b981;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
    }
    
    @media print {
      body {
        padding: 0;
      }
      
      .no-print {
        display: none;
      }
      
      h1, h2, h3 {
        page-break-after: avoid;
      }
      
      table, img {
        page-break-inside: avoid;
      }
      
      /* Garantir que os estilos sejam aplicados na impressão */
      .report-header {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      
      h2 {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      
      .info-box, .warning-box, .success-box {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      
      th {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
    }
  </style>
</head>
<body>
  <div class="report-header" style="background: linear-gradient(135deg, #0f172a 0%, #1e40af 50%, #3b82f6 100%); color: white; padding: 50px 40px; margin-bottom: 40px; -webkit-print-color-adjust: exact; print-color-adjust: exact; box-shadow: 0 8px 16px rgba(0,0,0,0.15);">
    <div style="max-width: 900px; margin: 0 auto;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 25px; border-bottom: 2px solid rgba(255,255,255,0.3); padding-bottom: 20px;">
        <div style="flex: 1;">
          <h1 style="font-size: 36px; font-weight: 800; margin: 0; letter-spacing: 2px; text-transform: uppercase; color: white; text-shadow: 3px 3px 6px rgba(0,0,0,0.3);">Altustec</h1>
          <div style="font-size: 14px; font-weight: 400; margin-top: 5px; color: rgba(255,255,255,0.85); letter-spacing: 3px;">INFORMÁTICA</div>
        </div>
        <div style="text-align: right; background: rgba(255,255,255,0.15); padding: 15px 25px; border-radius: 10px; backdrop-filter: blur(10px);">
          <div style="font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.8); margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px;">Período</div>
          <div style="font-size: 20px; font-weight: 700; color: white;">${monthName}</div>
        </div>
      </div>
      <div style="text-align: center; background: rgba(255,255,255,0.1); padding: 18px 30px; border-radius: 12px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);">
        <div style="font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.75); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1.5px;">Relatório de Desempenho</div>
        <div style="font-size: 24px; font-weight: 700; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">
          ${
            hasPaidTraffic && hasOrganicTraffic 
              ? '📊 Tráfego Pago & Orgânico'
              : hasPaidTraffic 
              ? '💰 Tráfego Pago'
              : hasOrganicTraffic
              ? '🌱 Tráfego Orgânico'
              : '📈 Análise de Desempenho'
          }
        </div>
      </div>
    </div>
  </div>
  
  <div class="content-wrapper">
    ${processedContent}
  </div>
  
  <script>
    window.onload = function() {
      // Mostrar alerta com instruções
      alert('IMPORTANTE:\\n\\n✅ Marque "Gráficos de fundo" nas opções de impressão\\n✅ Isso garante que as cores e formatação sejam preservadas no PDF\\n\\nClique em OK para abrir a janela de impressão.');
      
      setTimeout(function() {
        window.print();
        setTimeout(function() {
          window.close();
        }, 100);
      }, 500);
    };
  </script>
</body>
</html>
  `;

  printWindow.document.write(fullHTML);
  printWindow.document.close();
}
