import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Reports({ transactions }) {

  const incomeTransactions = transactions.filter(
    (t) => t.type === "income"
  );

  const expenseTransactions = transactions.filter(
    (t) => t.type === "expense"
  );

  const totalIncome = incomeTransactions.reduce(
    (acc, item) => acc + Number(item.amount),
    0
  );

  const totalExpense = expenseTransactions.reduce(
    (acc, item) => acc + Number(item.amount),
    0
  );

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
        t.title.toLowerCase().includes(search.toLowerCase());

    const matchesType =
        filterType === "all" || t.type === filterType;

    return matchesSearch && matchesType;
  });
  
  const downloadPDF = () => {

    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("FinTrack Financial Report", 20, 20);

    doc.setFontSize(14);
    doc.text(`Total Income: Rs. ${totalIncome}`, 20, 40);
    doc.text(`Total Expense: Rs. ${totalExpense}`, 20, 50);

    autoTable(doc, {
        startY: 70,

        head: [["Title", "Type", "Amount", "Category"]],

        body: transactions.map((t) => [
        t.title,
        t.type,
        `Rs. ${t.amount}`,
        t.category || "General",
        ]),
    });

    doc.save("FinTrack_Report.pdf");
  };

  return (
    <div className="reports-page">

      <h2 className="section-title">Financial Reports</h2>

      <div className="reports-grid">

        <div className="report-card income-report">
          <h3>Total Income</h3>
          <p>₹{totalIncome.toLocaleString("en-IN")}</p>
        </div>

        <div className="report-card expense-report">
          <h3>Total Expense</h3>
          <p>₹{totalExpense.toLocaleString("en-IN")}</p>
        </div>

      </div>

      <button
        className="download-btn"
        onClick={downloadPDF}
        >
        Download PDF
      </button>

      <div className="filter-bar">
        <input
            type="text"
            placeholder="Search transaction..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />

        <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
        >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
        </select>
      </div>

      <div className="report-table">

        <h3>All Transactions</h3>

        <table>

          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Category</th>
            </tr>
          </thead>

          <tbody>

            {filteredTransactions.map((t) => (
              <tr key={t._id}>
                <td>{t.title}</td>
                <td>{t.type}</td>
                <td>₹{Number(t.amount).toLocaleString("en-IN")}</td>
                <td>{new Date(t.date).toLocaleDateString("en-IN")}</td>
                <td>{t.category || "General"}</td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Reports;