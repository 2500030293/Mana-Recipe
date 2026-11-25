import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || form.password.length < 6) {
      setMessage("Please fill all fields (Password must be at least 6 characters).");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find((u) => u.email.toLowerCase() === form.email.trim().toLowerCase())) {
      setMessage("Email is already registered!");
      return;
    }

    users.push(form);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration Successful! Please login.");
    navigate("/login");
  };

  return (
    <>
      <header className="site-header">
        <Link className="brand" to="/">
          <span className="brand-icon">🍲</span>
          <span>Mana Recipes</span>
        </Link>
        <nav className="main-nav">
          <Link className="nav-link" to="/">Home</Link>
          <Link className="nav-link" to="/login">Login</Link>
          <Link className="nav-link active" to="/signup">Register</Link>
        </nav>
      </header>

      <main className="auth-page">
        <section className="auth-visual">
          <div className="auth-visual-text">
            <span className="eyebrow">JOIN OUR KITCHEN</span>
            <h1>Start your cooking journey today.</h1>
            <p>Create an account to save recipes, explore dishes, and access your personal dashboard.</p>
          </div>
        </section>

        <section className="auth-card">
          <span className="eyebrow">NEW ACCOUNT</span>
          <h2>Create Account</h2>
          <p className="muted">Fill in your details below to register.</p>

          <form onSubmit={handleSignup} className="form-card" noValidate>
            <label htmlFor="regName">Full Name</label>
            <input
              id="regName"
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <label htmlFor="regEmail">Email Address</label>
            <input
              id="regEmail"
              type="email"
              placeholder="Enter email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <label htmlFor="regPass">Password (minimum 6 chars)</label>
            <input
              id="regPass"
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            <label htmlFor="regRole">Account Type</label>
            <select
              id="regRole"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <button className="btn btn-primary full" type="submit">Register</button>
            {message && <p className="form-message" role="alert">{message}</p>}
          </form>

          <p className="auth-switch">
            Already registered? <Link to="/login">Login Here</Link>
          </p>
        </section>
      </main>
    </>
  );
}
