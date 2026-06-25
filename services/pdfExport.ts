import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { HealthRecord, FinanceRecord } from '../types';

export const exportHealthReport = (records: HealthRecord[], title: string = 'Health Report') => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
  
  autoTable(doc, {
    startY: 36,
    head: [['Date', 'Pig ID', 'Type', 'Description', 'Medication', 'Administered By']],
    body: records.map(record => [
      record.date,
      record.pigId,
      record.type,
      record.description,
      record.medication || '-',
      record.administeredBy
    ]),
    theme: 'grid',
    headStyles: { fillColor: [46, 204, 113] },
  });
  
  doc.save(`Health_Report_${new Date().getTime()}.pdf`);
};

export const exportFinancialReport = (records: FinanceRecord[], title: string = 'Financial Report') => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
  
  const income = records.filter(r => r.type === 'Income').reduce((sum, r) => sum + r.amount, 0);
  const expense = records.filter(r => r.type === 'Expense').reduce((sum, r) => sum + r.amount, 0);
  const balance = income - expense;

  doc.text(`Total Income: $${income.toFixed(2)} | Total Expenses: $${expense.toFixed(2)} | Net Balance: $${balance.toFixed(2)}`, 14, 38);

  autoTable(doc, {
    startY: 44,
    head: [['Date', 'Type', 'Category', 'Description', 'Amount', 'Status']],
    body: records.map(record => [
      record.date,
      record.type,
      record.category,
      record.description,
      `$${record.amount.toFixed(2)}`,
      record.status || '-'
    ]),
    theme: 'grid',
    headStyles: { fillColor: [52, 152, 219] },
  });
  
  doc.save(`Financial_Report_${new Date().getTime()}.pdf`);
};
