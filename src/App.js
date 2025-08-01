import React, { useState, useEffect } from "react";

/* ------------------------------------------------------------------
   The 500 Plan – v0.4
   • Ultra‑simple onboarding for US users: weight (lb), height (ft/in), age, sex
   • Assumes imperial units everywhere; converts internally for BMR math
   • Minimalist dashboard: calorie gauge, protein bar, food log, steps, weight
-------------------------------------------------------------------*/

// ------ helpers ---------------------------------------------------
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
  const [profile, setProfile] = useState(() => loadJSON("tfp_profile", null));

  /* ---------------- today entry ------------- */
  const [entry, setEntry] = useState(() => loadJSON("tfp_" + todayKey(), {
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
    const sex = fd.get("sex");
    const age = parseInt(fd.get("age"), 10);
    const weightLb = parseFloat(fd.get("weight"));
    const heightFt = parseInt(fd.get("heightFt"), 10);
    const heightIn = parseInt(fd.get("heightIn"), 10);

    const totalInches = heightFt * 12 + heightIn;
    const weightKg = lbToKg(weightLb);
    const heightCm = inchToCm(totalInches);

    // Mifflin–St Jeor BMR
    const bmr = sex === "male"
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

    const maintenance = bmr * 1.2;      // sedentary default
    const targetCals = maintenance - 500; // daily –500 kcal deficit
    const proteinTarget = weightKg * 1.6; // g per kg BW

    const p = { sex, age, weightLb, heightFt, heightIn, targetCals, proteinTarget };
    saveJSON("tfp_profile", p);
    setProfile(p);
  };

  /* ---------------- persist entry ----------- */
  useEffect(() => { saveJSON("tfp_" + todayKey(), entry); }, [entry]);

  /* ---------------- totals ------------------ */
  const totals = entry.foods.reduce((acc, f) => {
    acc.cals += Number(f.cals || 0);
    acc.protein += Number(f.protein || 0);
    return acc;
  }, { cals: 0, protein: 0 });

  /* ---------------- onboarding UI ----------- */
  if (!profile) {
    return (
      <div style={styles.container}>
        <h2 style={{marginTop:0}}>Quick Setup</h2>
        <form onSubmit={handleOnboard} style={styles.form}>
          <label>Sex:
            <select name="sex" defaultValue="male" style={styles.input}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>

          <label>Age:
            <input name="age" type="number" required style={styles.input} placeholder="e.g. 30" />
          </label>

          <label>Weight (lb):
            <input name="weight" type="number" step="0.1" required style={styles.input} placeholder="e.g. 180" />
          </label>

          <label>Height:
            <div style={{ display: "flex", gap: ".5rem" }}>
              <input name="heightFt" type="number" required style={{...styles.input,width:"100%"}} placeholder="ft" />
              <input name="heightIn" type="number" required style={{...styles.input,width:"100%"}} placeholder="in" />
            </div>
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
        <h4>Weight (lb)</h4>
        <input type="number" placeholder="Current weight (lb)" value={entry.weight} onChange={(e)=>setEntry({...entry,weight:e.target.value})} style={styles.input} />
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
