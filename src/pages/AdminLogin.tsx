import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { Shield, Lock, User, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (isLogin) {
      if (login(username, password)) {
        navigate("/admin/dashboard");
      } else {
        setError("Invalid credentials.");
      }
    } else {
      if (username.length < 3) {
        setError("Username must be at least 3 characters.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      const registered = register(username, password);
      if (registered) {
        setSuccess("Account created successfully! You can now log in.");
        setIsLogin(true);
        setPassword("");
      } else {
        setError("Username already exists.");
      }
    }
  };

  return (
    <div
      className="min-vh-100 d-flex flex-column align-items-center justify-content-center p-3"
      style={{ backgroundColor: "#0f172a" }}
    >
      <Link
        to="/"
        className="position-absolute top-0 start-0 m-4 text-decoration-none d-flex align-items-center gap-2 small"
        style={{ color: "#94a3b8" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
      >
        <ArrowLeft size={20} /> Back to Site
      </Link>

      <div className="w-100" style={{ maxWidth: 448 }}>
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
            style={{
              width: 64,
              height: 64,
              backgroundColor: "rgba(240,88,36,0.1)",
              color: "var(--color-brand)",
              border: "1px solid rgba(240,88,36,0.2)",
            }}
          >
            <Shield size={32} />
          </div>
          <h1 className="fs-3 fw-bold text-white mb-1">Admin</h1>
          <p className="mb-0" style={{ color: "#94a3b8" }}>
            Secure access to administration panel
          </p>
        </div>

        <div
          className="rounded-4 shadow p-4 p-md-5 border"
          style={{ backgroundColor: "#1e293b", borderColor: "#334155" }}
        >
          <form onSubmit={handleSubmit}>
            <h2 className="fs-5 fw-semibold text-white mb-4">
              {isLogin ? "Log In to Dashboard" : "Create Admin Account"}
            </h2>

            {success && (
              <div
                className="rounded-3 px-3 py-2 mb-3 small"
                style={{
                  backgroundColor: "rgba(16,185,129,0.1)",
                  border: "1px solid rgba(16,185,129,0.2)",
                  color: "#34d399",
                }}
              >
                {success}
              </div>
            )}

            <div className="mb-3">
              <label
                className="form-label small fw-medium"
                style={{ color: "#cbd5e1" }}
              >
                Administration Username
              </label>
              <div className="position-relative">
                <div
                  className="position-absolute top-50 translate-middle-y ms-3 pointer-events-none"
                  style={{ color: "#64748b" }}
                >
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                  className="form-control rounded-3 ps-5 text-white"
                  style={{
                    backgroundColor: "#0f172a",
                    borderColor: "#475569",
                    outline: "none",
                  }}
                  placeholder="Enter username..."
                  autoFocus
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                className="form-label small fw-medium"
                style={{ color: "#cbd5e1" }}
              >
                Administration Password
              </label>
              <div className="position-relative">
                <div
                  className="position-absolute top-50 translate-middle-y ms-3 pointer-events-none"
                  style={{ color: "#64748b" }}
                >
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="form-control rounded-3 ps-5 text-white"
                  style={{
                    backgroundColor: "#0f172a",
                    borderColor: "#475569",
                    outline: "none",
                  }}
                  placeholder="Enter password..."
                />
              </div>
              {error && <p className="mt-2 small text-danger">{error}</p>}
            </div>

            <button
              type="submit"
              className="btn w-100 fw-medium py-2 rounded-3 mb-3"
              style={{
                backgroundColor: "var(--color-brand)",
                color: "white",
                border: "none",
              }}
            >
              {isLogin ? "Access Dashboard" : "Create Account"}
            </button>

            <div className="d-flex align-items-center my-3">
              <div
                className="flex-grow-1 border-top"
                style={{ borderColor: "#334155" }}
              />
              <span className="mx-3 small" style={{ color: "#64748b" }}>
                or
              </span>
              <div
                className="flex-grow-1 border-top"
                style={{ borderColor: "#334155" }}
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setSuccess("");
              }}
              className="btn w-100 fw-medium py-2 rounded-3 text-white border"
              style={{ backgroundColor: "#334155", borderColor: "#475569" }}
            >
              {isLogin ? "Create Account" : "Back to Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
