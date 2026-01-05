import { useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import "../styles/forms.css";

export default function Auth() {
  const [mode, setMode] = useState("login"); 

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{mode === "login" ? "Login" : "Create Account"}</h2>

        {mode === "login" ? <LoginForm /> : <RegisterForm />}

        <p className="auth-toggle">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button onClick={() => setMode("register")}>
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button onClick={() => setMode("login")}>
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
