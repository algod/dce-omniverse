import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';

// Export chart as PNG
export async function exportChartAsPNG(elementId: string, filename: string = 'chart.png') {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id ${elementId} not found`);
    }

    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher quality
      logging: false
    });

    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, filename);
      }
    });
  } catch (error) {
    console.error('Error exporting chart as PNG:', error);
    throw error;
  }
}

// Export chart as SVG
export function exportChartAsSVG(svgElement: SVGElement, filename: string = 'chart.svg') {
  try {
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    saveAs(blob, filename);
  } catch (error) {
    console.error('Error exporting chart as SVG:', error);
    throw error;
  }
}

// Export data as CSV
export function exportDataAsCSV(data: any[], filename: string = 'data.csv') {
  try {
    if (!data || data.length === 0) {
      throw new Error('No data to export');
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        // Handle values that contain commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      });
      csvContent += values.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, filename);
  } catch (error) {
    console.error('Error exporting data as CSV:', error);
    throw error;
  }
}

// Export data as JSON
export function exportDataAsJSON(data: any, filename: string = 'data.json') {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    saveAs(blob, filename);
  } catch (error) {
    console.error('Error exporting data as JSON:', error);
    throw error;
  }
}

// Export multiple charts as PDF
export async function exportChartsAsPDF(
  elementIds: string[], 
  filename: string = 'report.pdf',
  title?: string
) {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Add title if provided
    if (title) {
      pdf.setFontSize(20);
      pdf.text(title, pageWidth / 2, 20, { align: 'center' });
    }

    for (let i = 0; i < elementIds.length; i++) {
      const element = document.getElementById(elementIds[i]);
      if (!element) continue;

      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pageWidth - 20; // Margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      if (i > 0) {
        pdf.addPage();
      }
      
      const yPosition = title && i === 0 ? 35 : 15;
      pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, imgHeight);
    }

    pdf.save(filename);
  } catch (error) {
    console.error('Error exporting charts as PDF:', error);
    throw error;
  }
}

// Export table data as Excel (using CSV format for simplicity)
export function exportTableAsExcel(
  headers: string[],
  rows: any[][],
  filename: string = 'table.csv'
) {
  try {
    let csvContent = headers.join(',') + '\n';
    
    rows.forEach(row => {
      const processedRow = row.map(cell => {
        if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))) {
          return `"${cell.replace(/"/g, '""')}"`;
        }
        return cell ?? '';
      });
      csvContent += processedRow.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, filename);
  } catch (error) {
    console.error('Error exporting table:', error);
    throw error;
  }
}

// Format data for export based on type
export function formatDataForExport(data: any, format: 'csv' | 'json' | 'excel') {
  if (format === 'json') {
    return exportDataAsJSON(data, `export_${Date.now()}.json`);
  }
  
  if (Array.isArray(data) && data.length > 0) {
    if (format === 'csv' || format === 'excel') {
      return exportDataAsCSV(data, `export_${Date.now()}.csv`);
    }
  }
  
  throw new Error(`Unsupported format: ${format}`);
}

// Create a formatted report combining multiple data sources
export interface ReportSection {
  title: string;
  data: any;
  type: 'chart' | 'table' | 'text';
  elementId?: string;
}

export async function generateReport(
  sections: ReportSection[],
  reportTitle: string,
  format: 'pdf' | 'html'
) {
  if (format === 'pdf') {
    const chartIds = sections
      .filter(s => s.type === 'chart' && s.elementId)
      .map(s => s.elementId!);
    
    await exportChartsAsPDF(chartIds, `${reportTitle}_${Date.now()}.pdf`, reportTitle);
  } else if (format === 'html') {
    // Generate HTML report
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${reportTitle}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #002B5C; }
          h2 { color: #0075BE; margin-top: 30px; }
          table { border-collapse: collapse; width: 100%; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .chart { margin: 20px 0; }
        </style>
      </head>
      <body>
        <h1>${reportTitle}</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
    `;
    
    for (const section of sections) {
      htmlContent += `<h2>${section.title}</h2>`;
      
      if (section.type === 'text') {
        htmlContent += `<p>${section.data}</p>`;
      } else if (section.type === 'table' && Array.isArray(section.data)) {
        htmlContent += '<table>';
        if (section.data.length > 0) {
          // Headers
          htmlContent += '<tr>';
          Object.keys(section.data[0]).forEach(key => {
            htmlContent += `<th>${key}</th>`;
          });
          htmlContent += '</tr>';
          
          // Rows
          section.data.forEach(row => {
            htmlContent += '<tr>';
            Object.values(row).forEach(value => {
              htmlContent += `<td>${value}</td>`;
            });
            htmlContent += '</tr>';
          });
        }
        htmlContent += '</table>';
      }
    }
    
    htmlContent += '</body></html>';
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    saveAs(blob, `${reportTitle}_${Date.now()}.html`);
  }
}