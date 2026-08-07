import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

/**
 * Exporta uma lista de objetos para arquivo CSV codificado em UTF-8 BOM
 */
export function exportToCSV(data: Record<string, any>[], filename: string) {
  if (!data || data.length === 0) {
    alert('Não há dados disponíveis para exportação.');
    return;
  }
  const headers = Object.keys(data[0]);
  const rows = data.map(row => 
    headers.map(h => {
      const val = row[h] ?? '';
      return `"${String(val).replace(/"/g, '""')}"`;
    }).join(';')
  );
  const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Exporta uma lista de objetos para arquivo Excel .XLSX nativo
 */
export function exportToXLSX(data: Record<string, any>[], filename: string, sheetName = 'Dados') {
  if (!data || data.length === 0) {
    alert('Não há dados disponíveis para exportação.');
    return;
  }
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
}

/**
 * Exporta dados tabulares para um documento PDF estilizado
 */
export function exportToPDF(title: string, headers: string[], rows: (string | number)[][], filename: string) {
  if (!rows || rows.length === 0) {
    alert('Não há dados disponíveis para exportação.');
    return;
  }
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  
  // Cabeçalho institucional
  doc.setFillColor(0, 32, 70); // #002046 AgroGestao Navy
  doc.rect(0, 0, 210, 24, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('AGROGESTAO - SISTEMA DE GESTÃO RURAL', 14, 11);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(title, 14, 18);

  // Sub-cabeçalho de data
  const dateStr = new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR');
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.text(`Relatório gerado em: ${dateStr}`, 14, 30);

  // Tabela zebrada com jspdf-autotable
  autoTable(doc, {
    startY: 33,
    head: [headers],
    body: rows,
    theme: 'striped',
    headStyles: {
      fillColor: [4, 120, 87], // Emerald 700
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    margin: { left: 14, right: 14 }
  });

  doc.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
}
