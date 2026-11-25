import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const defaultRecipes = [
  { id: 1, name: "Chicken Biryani", category: "Non-Veg", time: "45 mins", rating: 4.8, image: "/images/biriyani.jpg", steps: "Marinate chicken with spices, layer with basmati rice, and cook on dum." },
  { id: 2, name: "Paneer Butter Masala", category: "Veg", time: "30 mins", rating: 4.7, image: "/images/Paneer butter masala.jpg", steps: "Simmer paneer cubes in rich tomato, butter, and cashew gravy." },
  { id: 3, name: "Mutton Curry", category: "Non-Veg", time: "60 mins", rating: 4.9, image: "/images/Mutton curry.jpg", steps: "Slow-cook tender mutton pieces with onions, ginger-garlic, and garam masala." },
  { id: 4, name: "Veg Fried Rice", category: "Veg", time: "20 mins", rating: 4.5, image: "/images/fried rice.jpg", steps: "Toss cooked rice with chopped veggies, soy sauce, and pepper on high flame." }
];

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(currentUser);

    const saved = JSON.parse(localStorage.getItem("recipes"));
    if (saved && saved.length > 0) {
      setRecipes(saved);
    } else {
      localStorage.setItem("recipes", JSON.stringify(defaultRecipes));
      setRecipes(defaultRecipes);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

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
        <nav className="main-nav">
          <Link className="nav-link" to="/">Home</Link>
          <Link className="nav-link active" to="/user">Dashboard</Link>
          {user?.role === "admin" && <Link className="nav-link" to="/admin">Admin</Link>}
          <button onClick={handleLogout} className="nav-btn">Logout</button>
        </nav>
      </header>

      <main className="dashboard">
        <section className="welcome-card">
          <div>
            <span className="eyebrow">USER DASHBOARD</span>
            <h1>Welcome back, {user?.name || "Chef"}!</h1>
            <p className="muted">Explore all curated recipes and open step-by-step cooking instructions.</p>
          </div>
          <div className="avatar-large">
            {(user?.name || "C").charAt(0).toUpperCase()}
          </div>
        </section>

        <section className="section-heading compact">
          <div>
            <span className="eyebrow">RECIPE LIBRARY</span>
            <h2>Browse Collection</h2>
          </div>
          <p className="muted">Showing {filteredRecipes.length} recipes</p>
        </section>

        <section className="toolbar">
          <label className="search-box">
            <span>🔎</span>
            <input
              type="search"
              placeholder="Search recipes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
          <div className="details-card" style={{ marginBottom: "28px" }}>
            <div className="details-hero" style={{ height: "300px" }}>
              <img
                src={selectedRecipe.image.startsWith("/") ? selectedRecipe.image : `/${selectedRecipe.image}`}
                alt={selectedRecipe.name}
              />
              <div className="details-overlay">
                <span className={`category-pill ${selectedRecipe.category === "Veg" ? "veg" : "nonveg"}`}>
                  {selectedRecipe.category}
                </span>
                <h1>{selectedRecipe.name}</h1>
                <div className="details-meta">
                  <span>⏱️ {selectedRecipe.time}</span>
                  <span>⭐ {selectedRecipe.rating || 4.5}</span>
                </div>
              </div>
            </div>
            <div style={{ padding: "24px 32px" }}>
              <h3>Preparation Steps</h3>
              <p style={{ marginTop: "8px", marginBottom: "16px" }}>
                {selectedRecipe.steps || "Prepare fresh ingredients, cook on medium flame, and serve hot."}
              </p>
              <button className="btn btn-primary" onClick={() => setSelectedRecipe(null)}>Close Recipe</button>
            </div>
          </div>
        )}

        <section className="recipes-grid dashboard-grid">
          {filteredRecipes.map((r) => (
            <article className="recipe-card" key={r.id}>
              <div className="recipe-image-wrap">
                <img
                  className="recipe-img"
                  src={r.image.startsWith("/") ? r.image : `/${r.image}`}
                  alt={r.name}
                />
                <span className={`category-pill ${r.category === "Veg" ? "veg" : "nonveg"}`}>
                  {r.category}
                </span>
              </div>
              <div className="recipe-info">
                <h3>{r.name}</h3>
                <div className="recipe-meta">
                  <span>⏱️ {r.time}</span>
                  <span>⭐ {r.rating || 4.5}</span>
                </div>
                <a
                  href="#view"
                  className="view-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedRecipe(r);
                  }}
                >
                  View Recipe
                </a>
              </div>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
