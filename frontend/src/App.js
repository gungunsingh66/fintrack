import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

import Auth from "./components/Auth";
import "./App.css";
import Chart from "./components/Chart";
import LandingPage from "./pages/LandingPage";
import Reports from "./pages/Reports";
import CategoryChart from "./components/CategoryChart";
import MonthlyChart from "./components/MonthlyChart";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [editId, setEditId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );
  const [showAuth, setShowAuth] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Food");
  const [loading, setLoading] = useState(true);

  const API = "/api/transactions";
  
  //helper for token header
  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // FETCH DATA 
const fetchData = useCallback(async () => {
  try {
    setLoading(true);
    const res = await axios.get(
      API,
      getAuthConfig()
    );
    setTransactions(res.data);
  } catch (err) {
    console.log(err);
    if (err.response?.status === 401) {
      toast.error(
        "Session expired. Please login again."
      );
      localStorage.removeItem("token");
      setIsLoggedIn(false);
    }
  } finally {
    setLoading(false);
  }
}, []);;

  // useEffect fixed
  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn, fetchData]);

  // EDIT
  const handleEdit = (t) => {
    setTitle(t.title);
    setAmount(t.amount);
    setType(t.type);
    setDate(t.date);
    setCategory(t.category);
    setEditId(t._id);
  };

  // ADD / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const numericAmount = parseFloat(amount);

    if (!title.trim() || !numericAmount || isNaN(numericAmount)) {
      toast.error("Enter valid title and amount");
      return;
    }

    console.log("DATA SENT:", {
      title,
      amount: numericAmount,
      type,
      date,
      category
    });

    try {
      if (editId) {
        await axios.put(
          `${API}/${editId}`,
          {
            title,
            amount: numericAmount,
            type,
            date,
            category
          }, 
          getAuthConfig()
        );
        toast.success("Transaction updated");
        setEditId(null);
      } else {
        await axios.post(
          API,
          {
            title,
            amount: numericAmount,
            type,
            date,
            category
          },
          getAuthConfig()
        );
        toast.success("Transaction added");
      }

      setTitle("");
      setAmount("");
      setDate("");
      setCategory("Food");

      await fetchData();
    } catch (err) {
      console.log(err);
      toast.error(
        err.response?.data || "Something went wrong"
      );
    }
  };

  // DELETE
  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${API}/${id}`, getAuthConfig());
      toast.success("Transaction deleted");
      fetchData();
    } catch (err) {
      console.log(err);
      toast.error("Delete failed");
    }
  };

  // CALCULATIONS
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  // AUTH CHECK
  if (!isLoggedIn && !showAuth) {
    return (
      <LandingPage
        setShowAuth={setShowAuth}
        isLoggedIn={isLoggedIn}
      />
    );
  }

  if (!isLoggedIn && showAuth) {
    return <Auth
    setIsLoggedIn={setIsLoggedIn}
    setShowAuth={setShowAuth}
    />;
  }

  const formatCurrency = (num) => {
    if (num >= 10000000) {
      return (num / 10000000).toFixed(2) + "Cr";
    }

    if (num >= 100000) {
      return (num / 100000).toFixed(2) + "L";
    }

    return new Intl.NumberFormat("en-IN").format(num);
  };

  const categoryData = transactions
  .filter((t) => t.type === "expense")
  .reduce((acc, curr) => {

    const categoryName =
      curr.category || "General";

    const existing = acc.find(
      (item) => item.name === categoryName
    );

    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({
        name: categoryName,
        value: curr.amount,
      });
    }

    return acc;
  }, []);

  const monthlyData = transactions
  .filter((t) => t.type === "expense")
  .reduce((acc, curr) => {

    const month = new Date(curr.date).toLocaleString(
      "default",
      { month: "short" }
    );

    const existing = acc.find(
      (item) => item.month === month
    );

    if (existing) {
      existing.amount += curr.amount;
    } else {
      acc.push({
        month,
        amount: curr.amount,
      });
    }

    return acc;
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }
  return (
    <div className="container dashboard-page">
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <div className="main-card">  

        {/* LOGOUT */}
        <nav className="navbar">
          <div className="nav-logo">FinTrack</div>

          <div className="nav-links">
            <span
              className={currentPage === "dashboard" ? "active-link" : ""}
              onClick={() => setCurrentPage("dashboard")}
            >
              Dashboard
            </span>

            <span
              className={currentPage === "reports" ? "active-link" : ""}
              onClick={() => setCurrentPage("reports")}
            >
              Reports
            </span>

          </div>

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              setIsLoggedIn(false);
            }}
          >
            Logout
          </button>
        </nav>
        {currentPage === "dashboard" && (
        <>
          <h1 className="app-title">FinTrack</h1>
          <p className="tagline">Track. Analyze. Improve.</p>

          <div className="stats-grid">

            <div className="stat-card">
              <h4>Total Balance</h4>
              <p className={income - expense >= 0 ? "positive" : "negative"}>
                ₹{formatCurrency(income - expense)}
              </p>
            </div>

            <div className="stat-card">
              <h4>Total Income</h4>
              <p className="income-box">₹{formatCurrency(income)}</p>
            </div>

            <div className="stat-card">
              <h4>Total Expense</h4>
              <p className="expense-box">₹{formatCurrency(expense)}</p>
            </div>

            <div className="stat-card">
              <h4>Savings</h4>
              <p className="positive">₹{formatCurrency(income - expense)}</p>
            </div>

          </div>

          <div className="divider"></div>

          {/* CHART */}
          <div className="analytics-card">
            <h3>Spending Overview</h3>
            {transactions.length > 0 ? (
              <Chart
                income={income}
                expense={expense}
              />
            ) : (
              <p className="empty-text">
                No chart data available
              </p>
            )}
          </div>
          
          <div className="divider"></div>
          
          <div className="analytics-card">
            {categoryData.length > 0 ? (
              <CategoryChart data={categoryData} />
            ) : (
              <p className="empty-text">
                No category data
              </p>
            )}
          </div>

          <div className="divider"></div>

          <div className="analytics-card">
            {monthlyData.length > 0 ? (
              <MonthlyChart data={monthlyData} />
            ) : (
              <p className="empty-text">
                No monthly expense data
              </p>
            )}
          </div>

          {/* FORM */}
          <div className="form-card">
            <h3>{editId ? "Edit Transaction" : "Add Transaction"}</h3>

            <form className="form" onSubmit={handleSubmit}>
              <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <input
                placeholder="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Food">Food</option>
                <option value="Salary">Salary</option>
                <option value="Shopping">Shopping</option>
                <option value="Travel">Travel</option>
                <option value="Bills">Bills</option>
                <option value="Entertainment">Entertainment</option>
              </select>

              <button type="submit">
                {editId ? "Update Transaction" : "Add Transaction"}
              </button>
            </form>
          </div>

          {/* LIST */}
          <div className="transactions-card">

            <div className="transactions-header">
              <h3>Recent Transactions</h3>
              <span>{transactions.length} Records</span>
            </div>

            {transactions.length === 0 ? (
              <p className="empty-text">
                No transactions added yet.
              </p>
            ) : (
              transactions.map((t) => (
                <div className="transaction-item" key={t._id}>

                  <div className="transaction-left">
                    <h4>{t.title}</h4>

                    <p className="transaction-date">
                      {new Date(t.date).toLocaleDateString("en-IN")}
                    </p>

                    <p className="transaction-category">
                      {t.category || "General"}
                    </p>
                    
                    <p className={t.type}>
                      {t.type.toUpperCase()}
                    </p>
                  </div>

                  <div className="transaction-right">

                    <span className={t.type}>
                      ₹{t.amount}
                    </span>

                    <div className="actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(t)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => deleteTransaction(t._id)}
                      >
                        Delete
                      </button>
                    </div>

                  </div>

                </div>
              ))
            )}
          </div>
        </>
        )}
        {currentPage === "reports" && (
          <Reports transactions={transactions} />
        )}
      </div>
    </div>
  );
}

export default App;