// App.js
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

/* ───────────── Common helpers & constants ───────────── */
const SYSTEM_FONT =
  'system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
const DECIMAL_REGEX = /^\d*\.?\d*$/;
const CALS_PER_STEP = 0.04;
const navBtn = (active) => ({
  flex: 1,
  padding: 10,
  fontSize: 16,
  border: "none",
  background: "none",
  fontWeight: active ? "bold" : "normal",
  cursor: "pointer",
  fontFamily: SYSTEM_FONT,
});
const Info = ({ msg }) => (
  <span
    onClick={() => alert(msg)}
    style={{ marginLeft: 6, cursor: "pointer", color: "#0070f3", fontWeight: "bold" }}
    title="More info"
  >
    ⓘ
  </span>
);
const Bar = ({ v, g, color, label }) => (
  <>
    <div style={{ height: 20, background: "#e0e0e0", borderRadius: 10, overflow: "hidden" }}>
      <div
        style={{ width: `${Math.min((v / g) * 100, 100)}%`, background: color, height: "100%" }}
      />
    </div>
    <p style={{ margin: 4, fontFamily: SYSTEM_FONT }}>{label}</p>
  </>
);

/* ───────────── Starter food databases ───────────── */
const countFoods = [
  { name: "Egg", cal: 78, prot: 6 },
  { name: "Banana", cal: 105, prot: 1 },
  { name: "Apple", cal: 95, prot: 0.5 },
  { name: "Chicken Nugget", cal: 45, prot: 2.5 },
];
const weightFoods = [
  { name: "Chicken Breast", calPer100g: 165, protPer100g: 31 },
  { name: "Rice, cooked", calPer100g: 130, protPer100g: 2.7 },
];
const volumeFoods = [
  { name: "Oatmeal, cooked", calPerCup: 154, protPerCup: 6 },
  { name: "Milk, 2 %", calPerCup: 122, protPerCup: 8 },
];
const volumeUnits = [
  { label: "Tbsp", factor: 0.0625 },
  { label: "¼ Cup", factor: 0.25 },
  { label: "½ Cup", factor: 0.5 },
  { label: "Cups", factor: 1 },
];

/* ───────────── Food Logger ───────────── */
function FoodLogger({ foodLog, setFoodLog }) {
  const [mode, setMode] = useState("count"); // count | weight | volume
  const [unit, setUnit] = useState("Cups");
  const [search, setSearch] = useState("");
  const [amount, setAmount] = useState("");
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const options =
    mode === "count" ? countFoods : mode === "weight" ? weightFoods : volumeFoods;
  const filtered = options.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );
  const add = () => {
    if (!selected || amount === "") return setError("Pick food & amount");
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return setError("Enter a valid number");
    let cal = 0,
      prot = 0,
      label = "";
    if (mode === "count") {
      cal = selected.cal * amt;
      prot = selected.prot * amt;
      label = `${amt}× ${selected.name}`;
    } else if (mode === "weight") {
      cal = (selected.calPer100g * amt) / 100;
      prot = (selected.protPer100g * amt) / 100;
      label = `${amt} g ${selected.name}`;
    } else {
      const factor = amt * volumeUnits.find((u) => u.label === unit).factor;
      cal = selected.calPerCup * factor;
      prot = selected.protPerCup * factor;
      label = `${amt} ${unit} ${selected.name}`;
    }
    setFoodLog((l) => [...l, { name: label, cal, prot }]);
    setSearch(""); setAmount(""); setSelected(null); setError("");
  };
  return (
    <div style={{ fontFamily: SYSTEM_FONT }}>
      <h4>
        Log Food <Info msg="Choose method, amount, Add." />
      </h4>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        {["count", "weight", "volume"].map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setUnit("Cups");
              setSearch("");
              setAmount("");
              setSelected(null);
            }}
            style={{
              flex: 1,
              padding: 8,
              border: "1px solid #ccc",
              borderRadius: 4,
              background: mode === m ? "#0070f3" : "transparent",
              color: mode === m ? "#fff" : "#000",
            }}
          >
            {m === "count" ? "Count" : m === "weight" ? "Weight (g)" : "Volume"}
          </button>
        ))}
      </div>
      {mode === "volume" && (
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          {volumeUnits.map((u) => (
            <button
              key={u.label}
              onClick={() => setUnit(u.label)}
              style={{
                flex: 1,
                padding: 6,
                border: "1px solid #ccc",
                borderRadius: 4,
                background: unit === u.label ? "#0070f3" : "transparent",
                color: unit === u.label ? "#fff" : "#000",
              }}
            >
              {u.label}
            </button>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
        <input
          list="foods"
          placeholder="Food…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelected(options.find((o) => o.name === e.target.value) || null);
            setError("");
          }}
          style={{ flex: 1, padding: 6 }}
        />
        <datalist id="foods">
          {filtered.map((f) => (
            <option key={f.name} value={f.name} />
          ))}
        </datalist>
        <input
          placeholder="Amt"
          value={amount}
          onChange={(e) => {
            if (DECIMAL_REGEX.test(e.target.value)) setAmount(e.target.value);
          }}
          style={{ width: 80, padding: 6 }}
        />
        <button onClick={add}>Add</button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul style={{ marginTop: 12 }}>
        {foodLog.map((f, i) => (
          <li key={i}>
            {f.name} — {f.cal.toFixed(0)} kcal / {f.prot.toFixed(1)} g
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────────── Weight Section ───────────── */
function WeightSection({ weightLog, setWeightLog }) {
  const [temp, setTemp] = useState("");
  const add = () => {
    const w = parseFloat(temp);
    if (!isNaN(w))
      setWeightLog((l) => [...l, { date: new Date().toLocaleDateString(), weight: w }]);
    setTemp("");
  };
  const data = {
    labels: weightLog.map((w) => w.date),
    datasets: [{ label: "Weight", data: weightLog.map((w) => w.weight), tension: 0.2 }],
  };
  return (
    <div style={{ fontFamily: SYSTEM_FONT }}>
      <h3>
        Track Weight <Info msg="Log regularly, same time of day." />
      </h3>
      {weightLog.length > 0 && <Line data={data} />}
      <input
        placeholder="Today’s weight"
        value={temp}
        onChange={(e) => setTemp(e.target.value)}
        style={{ marginRight: 8 }}
      />
      <button onClick={add}>Log</button>
      <ul>
        {weightLog.map((w, i) => (
          <li key={i}>
            {w.date}: {w.weight} lb
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────────── Onboarding & Carousel ───────────── */
function ProfileForm({ onDone }) {
  const [sex, setSex] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const save = () => {
    localStorage.setItem("sex", sex);
    localStorage.setItem("age", age);
    localStorage.setItem("height", height);
    localStorage.setItem("weight", weight);
    localStorage.setItem("onboardingComplete", "true");
    onDone();
  };
  return (
    <div style={{ padding: 24, fontFamily: SYSTEM_FONT }}>
      <h2>Welcome to 500</h2>
      <label>
        Sex&nbsp;
        <select value={sex} onChange={(e) => setSex(e.target.value)}>
          <option></option>
          <option>male</option>
          <option>female</option>
        </select>
      </label>
      <br />
      <label>
        Age&nbsp;
        <input value={age} onChange={(e) => setAge(e.target.value)} />
      </label>
      <br />
      <label>
        Height&nbsp;(in)&nbsp;
        <input value={height} onChange={(e) => setHeight(e.target.value)} />
      </label>
      <br />
      <label>
        Weight&nbsp;(lbs)&nbsp;
        <input value={weight} onChange={(e) => setWeight(e.target.value)} />
      </label>
      <br />
      <button onClick={save} style={{ marginTop: 12 }}>
        Save & Start
      </button>
    </div>
  );
}
function HowItWorks({ onFinish }) {
  const cards = [
    { t: "Track food", s: "Log calories & protein fast." },
    { t: "Stay −500", s: "Eat ~500 kcal below maintenance." },
    { t: "Lose ≈1 lb/wk", s: "Consistency beats perfection." },
  ];
  const [i, setI] = useState(0);
  return (
    <div style={{ padding: 24, textAlign: "center", fontFamily: SYSTEM_FONT }}>
      <h2>{cards[i].t}</h2>
      <p>{cards[i].s}</p>
      <button
        onClick={() => {
          if (i < cards.length - 1) setI(i + 1);
          else {
            localStorage.setItem("seenHowItWorks", "true");
            onFinish();
          }
        }}
      >
        {i < cards.length - 1 ? "Next ➜" : "Start"}
      </button>
    </div>
  );
}

/* ───────────── Main App ───────────── */
export default function App() {
  const todayKey = () => {
    const d = new Date();
    return `foodLog-${d.toISOString().slice(0, 10)}`;
  };
  const [foodLog, setFoodLog] = useState(() =>
    JSON.parse(localStorage.getItem(todayKey()) || "[]")
  );
  const [steps, setSteps] = useState(() =>
    parseInt(localStorage.getItem("steps") || "0", 10)
  );
  const [weightLog, setWeightLog] = useState(() =>
    JSON.parse(localStorage.getItem("weightLog") || "[]")
  );
  useEffect(() => localStorage.setItem(todayKey(), JSON.stringify(foodLog)), [foodLog]);
  useEffect(() => localStorage.setItem("steps", steps.toString()), [steps]);
  useEffect(() => localStorage.setItem("weightLog", JSON.stringify(weightLog)), [weightLog]);

  const [screen, setScreen] = useState("home");
  const [showCarousel, setShowCarousel] = useState(
    localStorage.getItem("seenHowItWorks") !== "true"
  );
  const [needProfile, setNeedProfile] = useState(
    localStorage.getItem("onboardingComplete") !== "true"
  );

  /* derived */
  const weight = parseFloat(localStorage.getItem("weight") || "0");
  const height = parseInt(localStorage.getItem("height") || "0", 10);
  const age = parseInt(localStorage.getItem("age") || "0", 10);
  const sex = localStorage.getItem("sex") || "male";
  const calsToday = foodLog.reduce((s, f) => s + f.cal, 0);
  const proteinToday = Math.round(foodLog.reduce((s, f) => s + f.prot, 0));
  const proteinGoal = Math.round(weight * 0.8 || 0);
  const bmr = () => {
    if (!height || !weight || !age) return 1600;
    const cm = height * 2.54,
      kg = weight * 0.453592;
    return Math.round(
      sex === "male"
        ? 10 * kg + 6.25 * cm - 5 * age + 5
        : 10 * kg + 6.25 * cm - 5 * age - 161
    );
  };
  const calorieGoal = bmr() - 500 + steps * CALS_PER_STEP;

  /* gates */
  if (showCarousel) return <HowItWorks onFinish={() => setShowCarousel(false)} />;
  if (needProfile) return <ProfileForm onDone={() => setNeedProfile(false)} />;

  return (
    <div style={{ padding: 24, paddingBottom: 80, maxWidth: 500, margin: "auto" }}>
      {screen === "home" && (
        <>
          <h3>
            Calories <Info msg="Stay within daily budget. Steps raise it." />
          </h3>
          <Bar
            v={calsToday}
            g={calorieGoal}
            color="#4caf50"
            label={`${calsToday.toLocaleString()} / ${Math.round(calorieGoal).toLocaleString()} kcal`}
          />
          <h3>
            Protein <Info msg="Aim ≈0.8 g per lb body-weight." />
          </h3>
          <Bar v={proteinToday} g={proteinGoal} color="#2196f3" label={`${proteinToday} / ${proteinGoal} g`} />
          <h3>
            Steps <Info msg="~0.04 kcal burned per step." />
          </h3>
          <Bar v={steps} g={10000} color="#9c27b0" label={`${steps.toLocaleString()} / 10 000`} />
        </>
      )}
      {screen === "food" && <FoodLogger foodLog={foodLog} setFoodLog={setFoodLog} />}
      {screen === "weight" && <WeightSection weightLog={weightLog} setWeightLog={setWeightLog} />}

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          background: "#fff",
          borderTop: "1px solid #ccc",
          height: 60,
          boxShadow: "0 -1px 5px rgba(0,0,0,0.1)",
        }}
      >
        <button style={navBtn(screen === "home")} onClick={() => setScreen("home")}>
          🏠 Home
        </button>
        <button style={navBtn(screen === "food")} onClick={() => setScreen("food")}>
          📋 Log
        </button>
        <button style={navBtn(screen === "weight")} onClick={() => setScreen("weight")}>
          📈 Progress
        </button>
      </div>
    </div>
  );
}
