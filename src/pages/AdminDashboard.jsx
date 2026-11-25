import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const defaultRecipes = [
  { id: 1, name: "Chicken Biryani", category: "Non-Veg", time: "45 mins", rating: 4.8, image: "/images/biriyani.jpg", steps: "Marinate chicken with spices, layer with basmati rice, and cook on dum." },
  { id: 2, name: "Paneer Butter Masala", category: "Veg", time: "30 mins", rating: 4.7, image: "/images/Paneer butter masala.jpg", steps: "Simmer paneer cubes in rich tomato, butter, and cashew gravy." },
  { id: 3, name: "Mutton Curry", category: "Non-Veg", time: "60 mins", rating: 4.9, image: "/images/Mutton curry.jpg", steps: "Slow-cook tender mutton pieces with onions, ginger-garlic, and garam masala." },
  { id: 4, name: "Veg Fried Rice", category: "Veg", time: "20 mins", rating: 4.5, image: "/images/fried rice.jpg", steps: "Toss cooked rice with chopped veggies, soy sauce, and pepper on high flame." }
];

export default function AdminDashboard() {
  const [recipes, setRecipes] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "Veg",
    time: "",
    image: "/images/biriyani.jpg",
    rating: "4.5",
    steps: ""
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    const saved = JSON.parse(localStorage.getItem("recipes"));
    if (saved && saved.length > 0) {
      setRecipes(saved);
    } else {
      localStorage.setItem("recipes", JSON.stringify(defaultRecipes));
      setRecipes(defaultRecipes);
    }
  }, [navigate]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.time.trim()) {
      setMessage("Please fill in recipe name and cooking time.");
      return;
    }
    const updated = [...recipes, { ...form, id: Date.now() }];
    setRecipes(updated);
    localStorage.setItem("recipes", JSON.stringify(updated));
    setForm({
      name: "",
      category: "Veg",
      time: "",
      image: "/images/biriyani.jpg",
      rating: "4.5",
      steps: ""
    });
    setMessage("Recipe added successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDelete = (id) => {
    const updated = recipes.filter((r) => r.id !== id);
    setRecipes(updated);
    localStorage.setItem("recipes", JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
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
          <Link className="nav-link" to="/user">Dashboard</Link>
          <Link className="nav-link active" to="/admin">Admin</Link>
          <button onClick={handleLogout} className="nav-btn">Logout</button>
        </nav>
      </header>

      <main className="admin-page">
        <section className="section-heading">
          <div>
            <span className="eyebrow">ADMIN CONTROL</span>
            <h1>Recipe Inventory</h1>
            <p className="muted">Manage the recipes displayed on the website.</p>
          </div>
        </section>

        <section className="admin-layout">
          <div className="admin-form-card">
            <div className="card-heading">
              <span>➕</span>
              <div>
                <h2>Add Recipe</h2>
                <p>Publish a new recipe to the home page.</p>
              </div>
            </div>

            <form onSubmit={handleAdd} className="form-card" noValidate>
              <label htmlFor="recipeName">Recipe name</label>
              <input
                id="recipeName"
                type="text"
                placeholder="e.g. Masala Dosa"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />

              <label htmlFor="recipeCategory">Category</label>
              <select
                id="recipeCategory"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
              </select>

              <label htmlFor="recipeTime">Cooking time</label>
              <input
                id="recipeTime"
                type="text"
                placeholder="e.g. 30 mins"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                required
              />

              <label htmlFor="recipeImage">Food photo</label>
              <select
                id="recipeImage"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              >
                <option value="/images/biriyani.jpg">Chicken Biryani</option>
                <option value="/images/Paneer butter masala.jpg">Paneer Butter Masala</option>
                <option value="/images/Mutton curry.jpg">Mutton Curry</option>
                <option value="/images/fried rice.jpg">Veg Fried Rice</option>
              </select>

              <label htmlFor="recipeRating">Rating</label>
              <input
                id="recipeRating"
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
              />

              <label htmlFor="recipeSteps">Preparation Steps (Optional)</label>
              <input
                id="recipeSteps"
                type="text"
                placeholder="e.g. Cook on medium flame for 20 mins"
                value={form.steps}
                onChange={(e) => setForm({ ...form, steps: e.target.value })}
              />

              <button className="btn btn-primary full" type="submit">Add Recipe</button>
              {message && <p className="form-message" role="alert">{message}</p>}
            </form>
          </div>

          <div className="admin-table-card">
            <div className="card-heading">
              <span>📋</span>
              <div>
                <h2>Current Recipes</h2>
                <p>{recipes.length} recipes available</p>
              </div>
            </div>

            <div className="table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Recipe</th>
                    <th>Category</th>
                    <th>Time</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recipes.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <img
                          src={r.image.startsWith("/") ? r.image : `/${r.image}`}
                          alt={r.name}
                          style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "6px" }}
                        />
                      </td>
                      <td>{r.name}</td>
                      <td>{r.category}</td>
                      <td>{r.time}</td>
                      <td>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="btn"
                          style={{ background: "#dc2626", color: "white", padding: "6px 12px" }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
