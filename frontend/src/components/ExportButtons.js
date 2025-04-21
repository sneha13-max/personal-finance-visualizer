import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ExportButtons = ({ transactions }) => {
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Transaction Report", 14, 16);
    autoTable(doc, {
      startY: 22,
      head: [["Date", "Amount", "Description", "Category"]],
      body: transactions.map((txn) => [
        txn.date,
        txn.amount,
        txn.description,
        txn.category,
      ]),
    });
    doc.save("transactions.pdf");
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(transactions);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "transactions.xlsx");
  };

  return (
    <div className="flex gap-4 mb-6">
      <button
        onClick={exportPDF}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Export as PDF
      </button>
      <button
        onClick={exportExcel}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Export as Excel
      </button>
    </div>
  );
};

export default ExportButtons;
