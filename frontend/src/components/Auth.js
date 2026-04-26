import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Auth({ setIsLoggedIn }) {
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
    }
    catch (err) {
        console.log(err);
        alert(err.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="login-container">
        <div className="login-card">

            <h2 className="title">
                {isLogin ? "Login" : "Signup"}
            </h2>

            <form onSubmit={handleSubmit} className="form">

                <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />

                <div className="password-field">
                    <input
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}   // 👈 toggle happens here
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <span onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>

                <button type="submit">
                {isLogin ? "Login" : "Signup"}
                </button>
            </form>

            <p
                className="toggle-text"
                onClick={() => setIsLogin(!isLogin)}
            >
                {isLogin ? "Don’t have an account? " : "Already have an account? "}
                <span>{isLogin ? "Sign up" : "Login"}</span>
            </p>

        </div>
    </div>
    );
}

export default Auth;