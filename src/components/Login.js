import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (
      (email === "alessandro@gmail.com" && password === "password123") ||
      (email === "sofia@gmail.com" && password === "pass456")
    ) {
      onLogin(email);
    } else {
      alert("Credenziali non valide");
    }
  };

  const handleForgotPassword = () => {
    alert("Funzionalità di recupero password non ancora implementata.");
  };

  const handleRegister = () => {
    alert("Funzionalità di registrazione non ancora implementata.");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login">Login</h1>
        <input
          type="email"
          placeholder="Email"
          className="mailbox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="passbox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="loginbutton"
        >
          Accedi
        </button>
        <div className="flex flex-col items-center mt-4 space-y-2">
  <button onClick={handleForgotPassword} className="login-link">
    Password dimenticata?
  </button>
  <button onClick={handleRegister} className="login-link">
    Registrati
  </button>
</div>

      </div>
    </div>
  );
};

export default Login;
