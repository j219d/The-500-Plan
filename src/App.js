import React, { useState, useEffect } from "react";

// -------- helpers --------
const todayKey = () => new Date().toISOString().split("T")[0]; // YYYY-MM-DD

const saveJSON = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const loadJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export default function App() {
  /* ------------- profile state ------------- */
  const [profile, setProfile] = useState(() => loadJSON("paw_profile", null));

  /* ------------- daily entry ------------- */
  const [entry, setEntry] = useState(() => loadJSON("paw_" + todayKey(), {
    foods: [],
    steps: "",
    weight: ""
  }));

  /* ------------- temp food input ------------- */
  const [foodInput, setFoodInput] = useState({ name: "", cals: "", protein: "" });

  /* ------------- onboarding submit ------------- */
  const handleOnboard = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const sex = fd.get("sex");
    const weight = parseFloat(fd.get("weight"));
    const height = parseFloat(fd.get("height"));
    const age = parseInt(fd.get("age"), 10);

    // Mifflin‑St Jeor BMR
    const bmr = sex === "male" ? 10 * weight + 6.25 * height - 5 * age + 5 : 10 * weight + 6.25 * height - 5 * age - 161;
    const maintenance = bmr * 1.2; // sedentary multiplier (simple default)
    const targetCals = maintenance - 500; // 500 kcal deficit ≈ ‑0.45 kg / week
    const proteinTarget = weight * 1.6; // g per kg BW

    const p = { sex, weight, height, age, targetCals, proteinTarget };
    saveJSON("paw_profile", p);
    setProfile(p);
  };

  /* ------------- entry persistence ------------- */
  useEffect(() => {
    saveJSON("paw_" + todayKey(), entry);
  }, [entry]);

  /* ------------- small maths ------------- */
  const totals = entry.foods.reduce(
    (acc, f) => {
      acc.cals += Number(f.cals || 0);
      acc.protein += Number(f.protein || 0);
      return acc;
    },
    { cals: 0, protein: 0 }
  );

  if (!profile) {
    // ----- Onboarding form -----
    return (
      <div style={styles.container}>
        <h2>A Pound a Week – Quick Setup</h2>
        <form onSubmit={handleOnboard} style={styles.form}>
          <label>Sex:
            <select name="sex" required defaultValue="male" style={styles.input}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>
          <label>Weight (kg): <input name="weight" type="number" step="0.1" required style={styles.input}/></label>
          <label>Height (cm): <input name="height" type="number" step="0.1" required style={styles.input}/></label>
          <label>Age: <input name="age" type="number" required style={styles.input}/></label>
          <button style={styles.button}>Save & Continue</button>
        </form>
      </div>
    );
  }

  /* ------------- dashboard helpers ------------- */
  const calPercent = Math.min(100, (totals.cals / profile.targetCals) * 100);
  const proteinPercent = Math.min(100, (totals.protein / profile.proteinTarget) * 100);
  const calGood = totals.cals <= profile.targetCals;

  const addFood = (e) => {
    e.preventDefault();
    const { name, cals, protein } = foodInput;
    if (!name || !cals) return;
    setEntry({ ...entry, foods: [...entry.foods, { name, cals, protein }] });
    setFoodInput({ name: "", cals: "", protein: "" });
  };

  return (
    <div style={styles.container}>
      <h2>🟢 A Pound a Week</h2>

      {/* ------- calorie gauge ------- */}
      <section>
        <h3 style={styles.h3}>Daily Calories</h3>
        <div style={styles.gaugeBg}>
          <div style={{ ...styles.gaugeFill, width: `${calPercent}%`, background: calGood ? "#4caf50" : "#f44336" }} />
        </div>
        <p>{totals.cals.toFixed(0)} / {profile.targetCals.toFixed(0)} kcal</p>
      </section>

      {/* ------- protein bar ------- */}
      <section>
        <h3 style={styles.h3}>Protein</h3>
        <div style={styles.gaugeBg}>
          <div style={{ ...styles.gaugeFill, width: `${proteinPercent}%`, background: "#2196f3" }} />
        </div>
        <p>{totals.protein.toFixed(0)} / {profile.proteinTarget.toFixed(0)} g</p>
      </section>

      {/* ------- add food ------- */}
      <section style={styles.section}>
        <h4>Add Food</h4>
        <form onSubmit={addFood} style={{ display: "flex", flexDirection: "column" }}>
          <input placeholder="Name" value={foodInput.name} onChange={(e) => setFoodInput({ ...foodInput, name: e.target.value })} style={styles.input} required />
          <input placeholder="Calories" type="number" value={foodInput.cals} onChange={(e) => setFoodInput({ ...foodInput, cals: e.target.value })} style={styles.input} required />
          <input placeholder="Protein g" type="number" value={foodInput.protein} onChange={(e) => setFoodInput({ ...foodInput, protein: e.target.value })} style={styles.input} />
          <button style={styles.button}>Add</button>
        </form>
        {entry.foods.length > 0 && entry.foods.map((f, i) => (
          <div key={i} style={styles.foodItem}>
            <span>{f.name}</span>
            <span>{f.cals} kcal · {f.protein || 0} g</span>
          </div>
        ))}
      </section>

      {/* ------- steps ------- */}
      <section style={styles.section}>
        <h4>Steps</h4>
        <input type="number" placeholder="Today's steps" value={entry.steps} onChange={(e) => setEntry({ ...entry, steps: e.target.value })} style={styles.input} />
      </section>

      {/* ------- weight ------- */}
      <section style={styles.section}>
        <h4>Weight</h4>
        <input type="number" placeholder="Current weight (kg)" value={entry.weight} onChange={(e) => setEntry({ ...entry, weight: e.target.value })} style={styles.input} />
      </section>
    </div>
  );
}

/* ---------------- inline styles ---------------- */
const styles = {
  container: {
    maxWidth: 480,
    margin: "0 auto",
    padding: "1rem",
    fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Helvetica Neue,sans-serif",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: ".5rem",
  },
  input: {
    fontSize: "1rem",
    padding: "0.5rem",
  },
  button: {
    marginTop: ".5rem",
    padding: "0.5rem",
    fontSize: "1rem",
    cursor: "pointer",
  },
  h3: {
    marginBottom: ".25rem",
  },
  gaugeBg: {
    width: "100%",
    height: 20,
    background: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: ".25rem",
  },
  gaugeFill: {
    height: "100%",
    transition: "width .3s ease",
  },
  section: {
    marginTop: "1rem",
    borderTop: "1px solid #e0e0e0",
    paddingTop: ".5rem",
  },
  foodItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: ".25rem 0",
    borderBottom: "1px dotted #ccc",
    fontSize: "0.9rem",
  },
};


