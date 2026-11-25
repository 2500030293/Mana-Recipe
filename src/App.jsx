import "./index.css";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link } from "react-router-dom";

const defaultRecipes = [
  { id: 1, name: "Chicken Biryani", category: "Non-Veg", time: "45 mins", rating: 4.8, image: "/images/biriyani.jpg", steps: "Marinate chicken with spices, layer with basmati rice, and cook on dum." },
  { id: 2, name: "Paneer Butter Masala", category: "Veg", time: "30 mins", rating: 4.7, image: "/images/Paneer butter masala.jpg", steps: "Simmer paneer cubes in rich tomato, butter, and cashew gravy." },
  { id: 3, name: "Mutton Curry", category: "Non-Veg", time: "60 mins", rating: 4.9, image: "/images/Mutton curry.jpg", steps: "Slow-cook tender mutton pieces with onions, ginger-garlic, and garam masala." },
  { id: 4, name: "Veg Fried Rice", category: "Veg", time: "20 mins", rating: 4.5, image: "/images/fried rice.jpg", steps: "Toss cooked rice with chopped veggies, soy sauce, and pepper on high flame." }
];

const getSafeImage = (imgPath) => {
  if (!imgPath) return "";
  const cleanPath = imgPath.startsWith("/") ? imgPath : `/${imgPath}`;
  return encodeURI(cleanPath);
};

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("recipes"));
    if (saved && saved.length > 0) {
      setRecipes(saved);
    } else {
      localStorage.setItem("recipes", JSON.stringify(defaultRecipes));
      setRecipes(defaultRecipes);
    }
  }, []);

  const filteredRecipes = recipes.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || r.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <header className="site-header">
        <Link className="brand" to="/"><span className="brand-icon">🍲</span><span>Mana Recipes</span></Link>
        <nav className="main-nav">
          <Link className="nav-link active" to="/">Home</Link>
          <Link className="nav-link" to="/login">Login</Link>
          <Link className="nav-link" to="/signup">Register</Link>
          <Link className="nav-link" to="/user">Dashboard</Link>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">FRESH • SIMPLE • HOMEMADE</span>
          <h1>Discover recipes you will love to cook.</h1>
          <p>Browse tasty Indian favourites, search by name, filter by category and open every recipe for step-by-step instructions.</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#recipes">Explore Recipes</a>
            <Link className="btn btn-light" to="/login">Login to Dashboard</Link>
          </div>
        </div>
      </section>

      <main>
        <section className="section-heading" id="recipes">
          <div><span className="eyebrow">OUR COLLECTION</span><h2>Featured Recipes</h2></div>
          <p className="muted">Showing {filteredRecipes.length} recipes</p>
        </section>

        <section className="toolbar">
          <label className="search-box">
            <span>🔎</span>
            <input type="search" placeholder="Search recipes..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </label>
          <div className="filter-buttons">
            {["All", "Veg", "Non-Veg"].map((cat) => (
              <button key={cat} type="button" className={`filter-btn ${category === cat ? "active" : ""}`} onClick={() => setCategory(cat)}>{cat}</button>
            ))}
          </div>
        </section>

        {selectedRecipe && (
          <div className="details-card" style={{ marginBottom: "28px" }}>
            <div className="details-hero" style={{ height: "300px" }}>
              <img src={getSafeImage(selectedRecipe.image)} alt={selectedRecipe.name} />
              <div className="details-overlay">
                <span className={`category-pill ${selectedRecipe.category === "Veg" ? "veg" : "nonveg"}`}>{selectedRecipe.category}</span>
                <h1>{selectedRecipe.name}</h1>
                <div className="details-meta"><span>⏱️ {selectedRecipe.time}</span><span>⭐ {selectedRecipe.rating || 4.5}</span></div>
              </div>
            </div>
            <div style={{ padding: "24px 32px" }}>
              <h3>Preparation Steps</h3>
              <p style={{ marginTop: "8px", marginBottom: "16px" }}>{selectedRecipe.steps || "Cook with fresh ingredients and serve hot."}</p>
              <button className="btn btn-primary" onClick={() => setSelectedRecipe(null)}>Close Recipe</button>
            </div>
          </div>
        )}

        <section className="recipes-grid">
          {filteredRecipes.map((r) => (
            <article className="recipe-card" key={r.id}>
              <div className="recipe-image-wrap">
                <img className="recipe-img" src={getSafeImage(r.image)} alt={r.name} />
                <span className={`category-pill ${r.category === "Veg" ? "veg" : "nonveg"}`}>{r.category}</span>
              </div>
              <div className="recipe-info">
                <h3>{r.name}</h3>
                <div className="recipe-meta"><span>⏱️ {r.time}</span><span>⭐ {r.rating || 4.5}</span></div>
                <a href="#recipes" className="view-btn" onClick={(e) => { e.preventDefault(); setSelectedRecipe(r); }}>View Recipe</a>
              </div>
            </article>
          ))}
        </section>
      </main>

      <section className="feature-strip">
        <div><span>🍽️</span><strong>Easy Recipes</strong><small>Clear ingredients and steps</small></div>
        <div><span>⏱️</span><strong>Quick Search</strong><small>Find your favourite dish</small></div>
        <div><span>⭐</span><strong>Top Rated</strong><small>Curated starter collection</small></div>
        <div><span>🔐</span><strong>Account Access</strong><small>Login for your dashboard</small></div>
      </section>

      <footer className="site-footer">
        <div><Link className="brand footer-brand" to="/"><span className="brand-icon">🍲</span><span>Mana Recipes</span></Link><p>A clean recipe browsing project.</p></div>
        <div><h3>Pages</h3><Link to="/">Home</Link><Link to="/login">Login</Link><Link to="/signup">Register</Link><Link to="/user">Dashboard</Link><Link to="/admin">Admin</Link></div>
        <div><h3>Categories</h3><a href="#recipes" onClick={() => setCategory("All")}>All Recipes</a><a href="#recipes" onClick={() => setCategory("Veg")}>Vegetarian</a><a href="#recipes" onClick={() => setCategory("Non-Veg")}>Non-Vegetarian</a></div>
      </footer>
    </>
  );
}

function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (identifier.trim().toLowerCase() === "admin@gmail.com" && password === "admin123") {
      localStorage.setItem("currentUser", JSON.stringify({ name: "Admin", email: "admin@gmail.com", role: "admin" }));
      navigate("/admin");
      return;
    }
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const validUser = users.find((u) => (u.email.toLowerCase() === identifier.trim().toLowerCase() || (u.name && u.name.toLowerCase() === identifier.trim().toLowerCase())) && u.password === password);
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
        <Link className="brand" to="/"><span className="brand-icon">🍲</span><span>Mana Recipes</span></Link>
        <nav className="main-nav"><Link className="nav-link" to="/">Home</Link><Link className="nav-link active" to="/login">Login</Link><Link className="nav-link" to="/signup">Register</Link></nav>
      </header>
      <main className="auth-page">
        <section className="auth-visual"><div><span className="eyebrow">WELCOME BACK</span><h1>Cook something delicious today.</h1><p>Sign in to open your recipe dashboard.</p></div></section>
        <section className="auth-card">
          <span className="eyebrow">ACCOUNT LOGIN</span><h2>Sign in</h2>
          <form onSubmit={handleLogin} className="form-card">
            <label>Username or email</label>
            <input type="text" placeholder="Enter username or email" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
            <label>Password</label>
            <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button className="btn btn-primary full" type="submit">Login</button>
            {message && <p className="form-message error">{message}</p>}
          </form>
          <div className="demo-box"><strong>Admin demo</strong><span>Email: admin@gmail.com</span><span>Password: admin123</span></div>
          <p className="auth-switch">New here? <Link to="/signup">Create an account</Link></p>
        </section>
      </main>
    </>
  );
}

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || form.password.length < 6) {
      setMessage("Fill all fields (Password min 6 chars).");
      return;
    }
    const users = JSON.parse(localStorage.getItem("users")) || [];
