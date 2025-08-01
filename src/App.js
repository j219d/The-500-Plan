import React, { useState, useEffect } from "react";

/* ------------------------------------------------------------------
   Cal‑Deficit Tracker – v0.3
   • Unit selector moved *after* weight input so users enter the number
     first, then pick kg/lb (or cm/in) – as requested.
   • Dynamic labels update on <select> change.
-------------------------------------------------------------------*/

// helpers ----------------------------------------------------------
const todayKey = () => new Date().toISOString().split("T")[0];
const lbToKg = (lb) => lb * 0.45359237;
const inchToCm = (inch) => inch * 2.54;

const saveJSON = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const loadJSON = (k, fb) => {
  try { const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) : fb; }
  catch { return fb; }
};

export default function App() {
  /* ---------------- profile ---------------- */
  const [profile, setProfile] = useState(() => loadJSON("paw_profile", null));

  /* ---------------- today entry ------------- */
  const [entry, setEntry] = useState(() => loadJSON("paw_" + todayKey(), {
    foods: [],
    steps: "",
    weight: "",
  }));

  /* ---------------- temp food --------------- */
  const [foodInput, setFoodInput] = useState({ name: "", cals: "", protein: "" });

  /* ---------------- onboarding -------------- */
  const handleOnboard = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const units = fd.get("units");
    const weightRaw = parseFloat(fd.get("weight"));
    const heightRaw = parseFloat(fd.get("height"));
    const sex = fd.get("sex");
    const age = parseInt(fd.get("age"), 10);

    const weightKg = units === "imperial" ? lbToKg(weightRaw) : weightRaw;
    const heightCm = units === "imperial" ? inchToCm(heightRaw) : heightRaw;

    // Mifflin–St Jeor
    const bmr = sex === "male"
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

    const maintenance = bmr * 1.2;
    const targetCals = maintenance - 500;
    const proteinTarget = weightKg * 1.6;

    const p = { sex, age, units, weightStart: weightRaw, height: heightRaw, targetCals, proteinTarget };
    saveJSON("paw_profile", p);
    setProfile(p);
  };

  /* ---------------- persist entry ----------- */
  useEffect(() => { saveJSON("paw_" + todayKey(), entry); }, [entry]);

  /* ---------------- totals ------------------ */
  const totals = entry.foods.reduce((acc, f) => {
    acc.cals += Number(f.cals || 0);
    acc.protein += Number(f.protein || 0);
    return acc;
  }, { cals: 0, protein: 0 });

  /* ---------------- onboarding UI ----------- */
  if (!profile) {
    // small helper to sync label text
    const setLabels = (unit) => {
      document.getElementById("wt-unit").textContent = unit === "imperial" ? "lb" : "kg";
      document.getElementById("ht-unit").textContent = unit === "imperial" ? "in" : "cm";
    };

    return (
      <div style={styles.container}>
        <h2 style={{marginTop:0}}>Quick Setup</h2>
        <form onSubmit={handleOnboard} style={styles.form}>

          {/* sex first (unchanged) */}
          <label>Sex:
            <select name="sex" defaultValue="male" style={styles.input}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>

          {/* weight input first */}
          <label>Weight (<span id="wt-unit">kg</span>):
            <input
              name="weight" type="number" step="0.1" required style={styles.input}
              placeholder="e.g. 70"
            />
          </label>

          {/* unit selector comes next */}
          <label>Units:
            <select
              name="units"
              defaultValue="metric"
              style={styles.input}
              onChange={(e) => setLabels(e.target.value)}
            >
              <option value="metric">kg / cm</option>
              <option value="imperial">lb / in</option>
            </select>
          </label>

          {/* height */}
          <label>Height (<span id="ht-unit">cm</span>):
            <input
              name="height" type="number" step="0.1" required style={styles.input}
              placeholder="e.g. 170"
            />
          </label>

          {/* age */}
          <label>Age:
            <input name="age" type="number" required style={styles.input} placeholder="e.g. 30" />
          </label>

          <button style={styles.button}>Save & Continue</button>
        </form>
      </div>
    );
  }

  /* ---------------- dashboard UI ----------- */
  const calPercent = Math.min(100, (totals.cals / profile.targetCals) * 100);
  const proteinPercent = Math.min(100, (totals.protein / profile.proteinTarget) * 100);
  const calGood = totals.cals <= profile.targetCals;
  const wtLabel = profile.units === "imperial" ? "lbs" : "kg";

  const addFood = (e) => {
    e.preventDefault();
    if (!foodInput.name || !foodInput.cals) return;
    setEntry({ ...entry, foods: [...entry.foods, { ...foodInput }] });
    setFoodInput({ name: "", cals: "", protein: "" });
  };

  return (
    <div style={styles.container}>
      <h2 style={{marginTop:0}}>The 500 Plan</h2>

      {/* calorie gauge */}
      <section>
        <h3 style={styles.h3}>Daily Calories</h3>
        <div style={styles.gaugeBg}><div style={{...styles.gaugeFill,width:`${calPercent}%`,background:calGood?"#4caf50":"#f44336"}} /></div>
        <p>{totals.cals.toFixed(0)} / {profile.targetCals.toFixed(0)} kcal</p>
      </section>

      {/* protein bar */}
      <section>
        <h3 style={styles.h3}>Protein</h3>
        <div style={styles.gaugeBg}><div style={{...styles.gaugeFill,width:`${proteinPercent}%`,background:"#2196f3"}} /></div>
        <p>{totals.protein.toFixed(0)} / {profile.proteinTarget.toFixed(0)} g</p>
      </section>

      {/* food logger */}
      <section style={styles.section}>
        <h4>Add Food</h4>
        <form onSubmit={addFood} style={{display:"flex",flexDirection:"column"}}>
          <input placeholder="Name" value={foodInput.name} onChange={(e)=>setFoodInput({...foodInput,name:e.target.value})} style={styles.input} required />
          <input placeholder="Calories" type="number" value={foodInput.cals} onChange={(e)=>setFoodInput({...foodInput,cals:e.target.value})} style={styles.input} required />
          <input placeholder="Protein g" type="number" value={foodInput.protein} onChange={(e)=>setFoodInput({...foodInput,protein:e.target.value})} style={styles.input} />
          <button style={styles.button}>Add</button>
        </form>
        {entry.foods.map((f,i)=>(<div key={i} style={styles.foodItem}><span>{f.name}</span><span>{f.cals} kcal · {f.protein||0} g</span></div>))}
      </section>

      {/* steps */}
      <section style={styles.section}>
        <h4>Steps</h4>
        <input type="number" placeholder="Today's steps" value={entry.steps} onChange={(e)=>setEntry({...entry,steps:e.target.value})} style={styles.input} />
      </section>

      {/* weight */}
      <section style={styles.section}>
        <h4>Weight ({wtLabel})</h4>
        <input type="number" placeholder={`Current weight (${wtLabel})`} value={entry.weight} onChange={(e)=>setEntry({...entry,weight:e.target.value})} style={styles.input} />
      </section>
    </div>
  );
}

/* ---------------- styles ---------------- */
const styles = {
  container: { maxWidth: 480, margin: "0 auto", padding: "1rem", fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Helvetica Neue,sans-serif" },
  form: { display: "flex", flexDirection: "column", gap: ".5rem" },
  input: { fontSize: "1rem", padding: "0.5rem" },
  button: { marginTop: ".5rem", padding: "0.5rem", fontSize: "1rem", cursor: "pointer" },
  h3: { marginBottom: ".25rem" },
  gaugeBg: { width: "100%", height: 20, background: "#ddd", borderRadius: 10, overflow: "hidden", marginBottom
