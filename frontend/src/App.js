import React, { useEffect, useState } from "react";
import axios from "axios";

import Auth from "./components/Auth";
import "./App.css";
import Chart from "./components/Chart";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [editId, setEditId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const API = "http://localhost:5000/api/transactions";

  // 🔥 helper for token header
  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // ✅ FETCH DATA 
  const fetchData = async () => {
    try {
      const res = await axios.get(API, getAuthConfig());
      setTransactions(res.data);
    } catch (err) {
      console.log(err);

      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      }
    }
  };

  // ✅ useEffect fixed
  useEffect(() => {
    if (isLoggedIn){
       fetchData();
    }
  }, [isLoggedIn]);

  // ✅ EDIT
  const handleEdit = (t) => {
    setTitle(t.title);
    setAmount(t.amount);
    setType(t.type);
    setEditId(t._id);
  };

  // ✅ ADD / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const numericAmount = parseFloat(amount);

    if (!title.trim() || !numericAmount || isNaN(numericAmount)) {
      alert("Enter valid title and amount");
      return;
    }

    console.log("DATA SENT:", {
      title,
      amount: numericAmount,
      type
    });

    try {
      if (editId) {
        await axios.put(
          `${API}/${editId}`,
          {
            title,
            amount: numericAmount,
            type,
          },
          getAuthConfig()
        );
        setEditId(null);
      } else {
        await axios.post(
          API,
          {
            title,
            amount: numericAmount,
            type,
          },
          getAuthConfig()
        );
      }

      setTitle("");
      setAmount("");

      await fetchData();
    } catch (err) {
      console.log(err);
      alert(err.response?.data || "Something went wrong");
    }
  };

  // ✅ DELETE
  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${API}/${id}`, getAuthConfig());
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ CALCULATIONS
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  // 🔒 AUTH CHECK
  if (!isLoggedIn) {
    return <Auth setIsLoggedIn={setIsLoggedIn} />;
  }

  return (
    <div className="container">
      <div className="main-card">   {/* 👈 ADD THIS */}

        {/* LOGOUT */}
        <div className="logout-container">
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              setIsLoggedIn(false);
            }}
          >
            Logout
          </button>
        </div>

        <h1 className="app-title">FinTrack</h1>
        <p className="tagline">Track. Analyze. Improve.</p>

        <h2 className={`balance ${income - expense >= 0 ? "positive" : "negative"}`}>
          Balance: ₹{income - expense}
        </h2>

        {/* SUMMARY */}
        <div className="summary">
          <div className="box income-box">
            <h4>Income</h4>
            <p>₹{income}</p>
          </div>

          <div className="box expense-box">
            <h4>Expense</h4>
            <p>₹{expense}</p>
          </div>
        </div>

        <div className="divider"></div>

        {/* CHART */}
        <div className="chart-box">   {/* 👈 ADD THIS */}
          <Chart income={income} expense={expense} />
        </div>

        <div className="divider"></div>

        {/* FORM */}
        <form className="form" onSubmit={handleSubmit}>
          <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input placeholder="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />

          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <button type="submit">{editId ? "Update" : "Add"}</button>
        </form>

        {/* LIST */}
        <div className="transactions">   {/* 👈 ADD THIS */}
          {transactions.map((t) => (
            <div className="item" key={t._id}>
              <span className={t.type}>
                {t.title} - ₹{t.amount}
              </span>

              <div className="actions">
                <button onClick={() => handleEdit(t)}>Edit</button>
                <button className="delete-btn" onClick={() => deleteTransaction(t._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;