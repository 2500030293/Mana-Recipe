import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setMessage("Please enter both username/email and password.");
      return;
    }

    // Built-in Admin demo credentials from login.html
    if (identifier.trim().toLowerCase() === "admin@gmail.com" && password === "admin123") {
      const adminUser = { name: "Admin", email: "admin@gmail.com", role: "admin" };
      localStorage.setItem("currentUser", JSON.stringify(adminUser));
      navigate("/admin");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const validUser = users.find(
      (u) =>
        (u.email.toLowerCase() === identifier.trim().toLowerCase() ||
          (u.name && u.name.toLowerCase() === identifier.trim().toLowerCase())) &&
        u.password === password
    );

    if (!validUser) {
      setMessage("Invalid username/email or password!");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(validUser));
    navigate(validUser.role === "admin" ? "/admin" : "/user");
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
          <Link className="nav-link active" to="/login">Login</Link>
          <Link className="nav-link" to="/signup">Register</Link>
        </nav>
      </header>

      <main className="auth-page">
        <section className="auth-visual">
          <div className="auth-visual-text">
            <span className="eyebrow">WELCOME BACK</span>
            <h1>Cook something delicious today.</h1>
            <p>Sign in to open your recipe dashboard and browse the complete collection.</p>
          </div>
        </section>

        <section className="auth-card">
          <span className="eyebrow">ACCOUNT LOGIN</span>
          <h2>Sign in</h2>
          <p className="muted">Use your registered account to continue.</p>

          <form onSubmit={handleLogin} className="form-card" noValidate>
            <label htmlFor="loginUser">Username or email</label>
            <input
              id="loginUser"
              name="username"
              type="text"
              placeholder="Enter username or email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              autoComplete="username"
            />

            <label htmlFor="loginPass">Password</label>
            <input
              id="loginPass"
              name="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            <button className="btn btn-primary full" type="submit">Login</button>
            {message && <p className="form-message" role="alert">{message}</p>}
          </form>

          <div className="demo-box">
            <strong>Admin demo</strong>
            <span>Email: admin@gmail.com</span>
            <span>Password: admin123</span>
          </div>

          <p className="auth-switch">
            New here? <Link to="/signup">Create an account</Link>
          </p>
        </section>
      </main>
    </>
  );
}
