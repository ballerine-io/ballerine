import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';

interface jsPDFWithPlugin extends jsPDF {
  autoTable: any;
}

export const convertCsvToPdfBase64String = (csvBase64: string) => {
  // Extract base64 data from data URI
  const base64Data = csvBase64.split(',')[1] || csvBase64;

  // Decode base64 to string
  const csvString = atob(base64Data);

  // Parse CSV string to array using PapaParse
  const { data } = Papa.parse(csvString, {
    header: true,
    skipEmptyLines: true,
  });

  // Create new PDF document
  const doc = new jsPDF() as jsPDFWithPlugin;

  // Add table to PDF using autoTable
  doc.autoTable({
    head: [Object.keys(data[0] as object)], // Column headers
    body: data.map(row => Object.values(row as object)), // Row data
    startY: 10,
    margin: { top: 10 },
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 66, 66] },
  });

  return doc.output('datauristring');
};
