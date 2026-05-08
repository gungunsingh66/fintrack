import React from "react";

function LandingPage({ setShowAuth }) {
  return (
    <div className="landing-page">

      {/* Navbar */}
      <nav className="landing-navbar">
        <div className="brand-logo">FinTrack</div>

        <div className="nav-menu">
          <span>Features</span>
          <span>About</span>
          <span onClick={() => setShowAuth(true)}>Login</span>
        </div>
      </nav>

      {/* Hero */}
      <div className="hero-card">
        <h1 className="hero-title">FinTrack</h1>

        <p className="hero-subtitle">
          Track expenses, analyze spending, and improve your finances.
        </p>

        <div className="hero-buttons">
          <button
            className="primary-btn"
            onClick={() => setShowAuth(true)}
          >
            Get Started
          </button>

          <button
            className="secondary-btn"
            onClick={() => setShowAuth(true)}
          >
            Login
          </button>
        </div>

        {/* Features */}
        <div className="features">
          <div className="feature-box">📊 Smart Charts</div>
          <div className="feature-box">💰 Expense Tracking</div>
          <div className="feature-box">🔐 Secure Login</div>
        </div>
      </div>

      {/* Footer */}
      <footer className="landing-footer">
        © 2026 FinTrack. All rights reserved.
      </footer>

    </div>
  );
}

export default LandingPage;