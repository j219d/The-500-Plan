import React, { useState, useEffect } from "react";

const todayKey = () => new Date().toISOString().split("T")[0];
const lbToKg = (lb) => lb * 0.45359237;
const inchToCm = (inch) => inch * 2.54;
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const load = (k, fallback) => {
  try {
    const raw = localStorage.getItem(k);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export default function Home() {
  const [profile, setProfile] = useState(() => load("tfp_profile", null));
  const [entry, setEntry] = useState(() => load("tfp_" + todayKey(), {
    foods: [], steps: "", weight: ""
  }));
  const [food, setFood] = useState({ name: "", cals: "", protein: "" });

  useEffect(() => { save("tfp_" + todayKey(), entry); }, [entry]);

  const totals = entry.foods.reduce((a, f) => {
    a.cals += +f.cals || 0;
    a.protein += +f.protein || 0;
    return a;
  }, { cals: 0, protein: 0 });

  const handleOnboard = (e) => {
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
  };

  if (!profile) {
    return (
      <div className="container">
        <h2>The 500 Plan – Quick Setup</h2>
        <form onSubmit={handleOnboard}>
          <label>Sex:
            <select name="sex" defaultValue="male"><option value="male">Male</option><option value="female">Female</option></select>
          </label><br />
          <label>Age: <input name="age" type="number" required /></label><br />
          <label>Weight (lb): <input name="weight" type="number" step="0.1" required /></label><br />
          <label>Height: <input name="heightFt" type="number" required placeholder="ft" style={{ width: '4rem' }} /> <input name="heightIn" type="number" required placeholder="in" style={{ width: '4rem' }} /></label><br />
          <button type="submit">Save & Continue</button>
        </form>
      </div>
    );
  }

  const calPercent = Math.min(100, (totals.cals / profile.targetCals) * 100);
  const proteinPercent = Math.min(100, (totals.protein / profile.proteinTarget) * 100);
  const calGood = totals.cals <= profile.targetCals;

  const addFood = (e) => {
    e.preventDefault();
    if (!food.name || !food.cals) return;
    setEntry({ ...entry, foods: [...entry.foods, food] });
    setFood({ name: "", cals: "", protein: "" });
  };

  return (
    <div className="container">
      <h2>The 500 Plan</h2>

      <h3>Daily Calories</h3>
      <div className="gauge-bg">
        <div className="gauge-fill" style={{ width: calPercent + '%', background: calGood ? '#4caf50' : '#f44336' }}></div>
      </div>
      <p>{totals.cals.toFixed(0)} / {profile.targetCals.toFixed(0)} kcal</p>

      <h3>Protein</h3>
      <div className="gauge-bg">
        <div className="gauge-fill" style={{ width: proteinPercent + '%', background: '#2196f3' }}></div>
      </div>
      <p>{totals.protein.toFixed(0)} / {profile.proteinTarget.toFixed(0)} g</p>

      <div className="section">
        <h4>Add Food</h4>
        <form onSubmit={addFood}>
          <input placeholder="Name" value={food.name} onChange={e => setFood({ ...food, name: e.target.value })} required />
          <input type="number" placeholder="Calories" value={food.cals} onChange={e => setFood({ ...food, cals: e.target.value })} required />
          <input type="number" placeholder="Protein g" value={food.protein} onChange={e => setFood({ ...food, protein: e.target.value })} />
          <button type="submit">Add</button>
        </form>
        {entry.foods.map((f, i) => (
          <div className="food-item" key={i}><span>{f.name}</span><span>{f.cals} kcal · {f.protein || 0}g</span></div>
        ))}
      </div>

      <div className="section">
        <h4>Steps</h4>
        <input type="number" placeholder="Today's steps" value={entry.steps} onChange={e => setEntry({ ...entry, steps: e.target.value })} />
      </div>

      <div className="section">
        <h4>Weight (lb)</h4>
        <input type="number" placeholder="Current weight (lb)" value={entry.weight} onChange={e => setEntry({ ...entry, weight: e.target.value })} />
      </div>
    </div>
  );
}
