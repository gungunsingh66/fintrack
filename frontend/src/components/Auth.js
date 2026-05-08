import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";

function Auth({ setIsLoggedIn, setShowAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/signup";

    try {
      const res = await axios.post(url, { email, password });

      if (isLogin) {
        localStorage.setItem("token", res.data.token);
        setIsLoggedIn(true);
      } else {
        alert("Signup successful");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="login-container">

      <button
        className="back-home-btn"
        onClick={() => setShowAuth(false)}
      >
        <FaArrowLeft /> Back Home
      </button>

      <div className="login-card">

        <h1 className="auth-brand">FinTrack</h1>

        <h2 className="title">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        <p className="auth-subtitle">
          {isLogin
            ? "Login to manage your finances."
            : "Start tracking smarter today."}
        </p>

        <form onSubmit={handleSubmit} className="form">

          <input
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="password-field">
            <input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p
          className="toggle-text"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don’t have an account? "
            : "Already have an account? "}
          <span>{isLogin ? "Sign up" : "Login"}</span>
        </p>

      </div>
    </div>
  );
}

export default Auth;