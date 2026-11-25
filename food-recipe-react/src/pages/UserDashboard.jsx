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

      <main>
        <section className="section-heading">
          <div>
            <span className="eyebrow">USER DASHBOARD</span>
            <h1>Welcome, {user?.name || "Chef"}!</h1>
            <p className="muted">Search, filter, and explore step-by-step recipes.</p>
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
            <p style={{ marginTop: "10px" }}>
              <strong>Preparation Steps:</strong> {selectedRecipe.steps || "Prepare fresh ingredients, cook on medium flame, and serve hot."}
            </p>
          </div>
        )}

        <section className="recipes-grid">
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
    </>
  );
}
