import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const defaultRecipes = [
  { id: 1, name: "Chicken Biryani", category: "Non-Veg", time: "45 mins", rating: 4.8, image: "/images/biriyani.jpg", steps: "Marinate chicken with spices, layer with basmati rice, and cook on dum." },
  { id: 2, name: "Paneer Butter Masala", category: "Veg", time: "30 mins", rating: 4.7, image: "/images/Paneer butter masala.jpg", steps: "Simmer paneer cubes in rich tomato, butter, and cashew gravy." },
  { id: 3, name: "Mutton Curry", category: "Non-Veg", time: "60 mins", rating: 4.9, image: "/images/Mutton curry.jpg", steps: "Slow-cook tender mutton pieces with onions, ginger-garlic, and garam masala." },
  { id: 4, name: "Veg Fried Rice", category: "Veg", time: "20 mins", rating: 4.5, image: "/images/fried rice.jpg", steps: "Toss cooked rice with chopped veggies, soy sauce, and pepper on high flame." }
];

export default function Home() {
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
        <Link className="brand" to="/">
          <span className="brand-icon">🍲</span>
          <span>Mana Recipes</span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
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
          <p>Browse tasty Indian favourites, search by name, filter by category and open every recipe for ingredients and step-by-step instructions.</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#recipes">Explore Recipes</a>
            <Link className="btn btn-light" to="/login">Login to Dashboard</Link>
          </div>
        </div>
      </section>

      <main>
        <section className="section-heading" id="recipes">
          <div>
            <span className="eyebrow">OUR COLLECTION</span>
            <h2>Featured Recipes</h2>
          </div>
          <p className="muted">Showing {filteredRecipes.length} recipes</p>
        </section>

        <section className="toolbar" aria-label="Recipe search and filters">
          <label className="search-box">
            <span>🔎</span>
            <input
              type="search"
              placeholder="Search recipes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
            />
          </label>
          <div className="filter-buttons">
            {["All", "Veg", "Non-Veg"].map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-btn ${category === cat ? "active" : ""}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {selectedRecipe && (
          <div className="admin-form-card" style={{ marginBottom: "24px", border: "2px solid #e11d48" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3>{selectedRecipe.name} ({selectedRecipe.category})</h3>
              <button className="btn btn-light" onClick={() => setSelectedRecipe(null)}>Close ✖</button>
            </div>
            <p className="muted">⏱️ {selectedRecipe.time} | ⭐ {selectedRecipe.rating || 4.5}</p>
            <p style={{ marginTop: "10px" }}><strong>Preparation Steps:</strong> {selectedRecipe.steps || "Cook with fresh ingredients and serve hot."}</p>
          </div>
        )}

        <section className="recipes-grid" aria-live="polite">
          {filteredRecipes.map((r) => (
            <article className="recipe-card" key={r.id}>
              <img
                src={r.image.startsWith("/") ? r.image : `/${r.image}`}
                alt={r.name}
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />
              <div className="recipe-body" style={{ padding: "16px" }}>
                <span className="eyebrow">{r.category}</span>
                <h3>{r.name}</h3>
                <p className="muted">⏱️ {r.time} • ⭐ {r.rating || 4.5}</p>
                <button
                  className="btn btn-primary full"
                  style={{ marginTop: "12px" }}
                  onClick={() => setSelectedRecipe(r)}
                >
                  View Recipe
                </button>
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
        <div>
          <Link className="brand footer-brand" to="/">
            <span className="brand-icon">🍲</span>
            <span>Mana Recipes</span>
          </Link>
          <p>A clean recipe browsing project inspired by the supplied reference website layout.</p>
        </div>
        <div>
          <h3>Pages</h3>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/signup">Register</Link>
          <Link to="/user">Dashboard</Link>
          <Link to="/admin">Admin</Link>
        </div>
        <div>
          <h3>Recipe Categories</h3>
          <a href="#recipes" onClick={() => setCategory("All")}>All Recipes</a>
          <a href="#recipes" onClick={() => setCategory("Veg")}>Vegetarian</a>
          <a href="#recipes" onClick={() => setCategory("Non-Veg")}>Non-Vegetarian</a>
        </div>
      </footer>
    </>
  );
}
