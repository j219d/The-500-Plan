import React, { useState, useEffect } from "react";

const todayKey = () => new Date().toISOString().split("T")[0];
const lbToKg = (lb) => lb * 0.45359237;
const inchToCm = (inch) => inch * 2.54;

const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const load = (k, fb) => {
  try {
    const raw = localStorage.getItem(k);
    return raw ? JSON.parse(raw) : fb;
  } catch {
    return fb;
  }
};

export default function App() {
  const [tab, setTab] = useState("home");
  const [profile, setProfile] = useState(() => load("tfp_profile", null));
  const [editingProfile, setEditingProfile] = useState(false);
  const [entry, setEntry] = useState(() => load("tfp_" + todayKey(), {
    foods: [],
    steps: "",
    weight: ""
  }));
  const [food, setFood] = useState({ name: "", cals: "", protein: "" });

  useEffect(() => { save("tfp_" + todayKey(), entry); }, [entry]);

  const caloriesFromSteps = () => {
    const steps = parseInt(entry.steps || "0", 10);
    return Math.round(steps * 0.04);
  };

  const totals = entry.foods.reduce((a, f) => {
    a.cals += +f.cals || 0;
    a.protein += +f.protein || 0;
    return a;
  }, { cals: 0, protein: 0 });

  const calTotal = totals.cals;
  const proteinTotal = totals.protein;
  const extraCals = caloriesFromSteps();
  const calorieGoal = profile ? Math.round(profile.targetCals + extraCals) : 0;
  const calPercent = Math.min(100, (calTotal / calorieGoal) * 100);
  const proteinPercent = Math.min(100, (proteinTotal / profile.proteinTarget) * 100);
  const calGood = calTotal <= calorieGoal;

  const saveProfile = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const sex = fd.get("sex");
    const age = +fd.get("age");
    const weightLb = +fd.get("weight");
    const heightFt = +fd.get("heightFt");
    const heightIn = +fd.get("heightIn");
    const weightKg = lbToKg(weightLb);
    const heightCm = inchToCm(heightFt * 12 + heightIn);
    const bmr = sex === "male"
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    const maintenance = bmr * 1.2;
    const targetCals = maintenance - 500;
    const proteinTarget = weightKg * 1.6;
    const p = { sex, age, weightLb, heightFt, heightIn, targetCals, proteinTarget };
    save("tfp_profile", p);
    setProfile(p);
    setEditingProfile(false);
  };

  const addFood = (e) => {
    e.preventDefault();
    if (!food.name || !food.cals) return;
    setEntry({ ...entry, foods: [...entry.foods, food] });
    setFood({ name: "", cals: "", protein: "" });
  };

  if (!profile || editingProfile) {
    return (
      <div className="container">
        <h2>{!profile ? 'Setup' : 'Edit Profile'}</h2>
        <form onSubmit={saveProfile}>
          <label>Sex:
            <select name="sex" defaultValue={profile?.sex || "male"}>
              <option>male</option>
              <option>female</option>
            </select>
          </label><br />
          <label>Age: <input name="age" defaultValue={profile?.age || ""} required /></label><br />
          <label>Weight (lb): <input name="weight" defaultValue={profile?.weightLb || ""} required /></label><br />
          <label>Height:
            <input name="heightFt" defaultValue={profile?.heightFt || ""} placeholder="ft" required style={{ width: "3rem" }} />
            <input name="heightIn" defaultValue={profile?.heightIn || ""} placeholder="in" required style={{ width: "3rem" }} />
          </label><br />
          <button type="submit">Save</button>
        </form>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>The 500 Plan</h2>
        <button onClick={() => setEditingProfile(true)} style={{
          fontSize: '1.2rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer'
        }}>⚙️</button>
      </div>

      {tab === "home" && (
        <>
          <h3>Calories</h3>
          <div className="gauge-bg">
            <div className="gauge-fill" style={{ width: calPercent + "%", background: calGood ? "#4caf50" : "#f44336" }}></div>
          </div>
          <p>{calTotal} / {calorieGoal} kcal</p>

          <h3>Protein</h3>
          <div className="gauge-bg">
            <div className="gauge-fill" style={{ width: proteinPercent + "%", background: "#2196f3" }}></div>
          </div>
          <p>{proteinTotal} / {profile.proteinTarget.toFixed(0)} g</p>

          <div className="section">
            <h4>Steps</h4>
            <input type="number" value={entry.steps} onChange={e => setEntry({ ...entry, steps: e.target.value })} />
            <p>+{extraCals} kcal bonus</p>
          </div>
        </>
      )}

      {tab === "food" && (
        <>
          <h2>Log Food</h2>
          <form onSubmit={addFood}>
            <input placeholder="Food" value={food.name} onChange={e => setFood({ ...food, name: e.target.value })} />
            <input type="number" placeholder="Calories" value={food.cals} onChange={e => setFood({ ...food, cals: e.target.value })} />
            <input type="number" placeholder="Protein" value={food.protein} onChange={e => setFood({ ...food, protein: e.target.value })} />
            <button type="submit">Add</button>
          </form>
        </>
      )}

      {tab === "weight" && (
        <>
          <h2>Track Weight</h2>
          <input type="number" placeholder="Current weight (lb)" value={entry.weight} onChange={e => setEntry({ ...entry, weight: e.target.value })} />
        </>
      )}

      <nav className="bottom-nav">
        <button onClick={() => setTab("home")}>🏠 Home</button>
        <button onClick={() => setTab("food")}>🍽 Food</button>
        <button onClick={() => setTab("weight")}>⚖️ Weight</button>
      </nav>

      <style jsx>{`
        .container {
          max-width: 480px;
          margin: 0 auto;
          padding: 1rem;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }
        input, button {
          padding: 0.5rem;
          margin: 0.25rem 0;
          width: 100%;
          font-size: 1rem;
        }
        .gauge-bg {
          height: 20px;
          background: #eee;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: .25rem;
        }
        .gauge-fill {
          height: 100%;
          transition: width .3s ease;
        }
        .section {
          margin-top: 1rem;
          border-top: 1px solid #ccc;
          padding-top: 0.5rem;
        }
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          display: flex;
          justify-content: space-around;
          background: white;
          border-top: 1px solid #ccc;
          padding: 0.5rem 0;
        }
        .bottom-nav button {
          flex: 1;
          font-size: 1.2rem;
          border: none;
          background: none;
        }
      `}</style>
    </div>
  );
}
