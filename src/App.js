import React, { useState, useEffect, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

// ── Simple reusable info button with tap feedback ────────────────────────
const InfoButton = ({ message }) => (
  <span
    onClick={() => {
      alert(message);
      if (navigator.vibrate) navigator.vibrate(10);
    }}
    style={{
      marginLeft: 6,
      cursor: "pointer",
      color: "#0070f3",
      fontWeight: "bold",
      userSelect: "none",
    }}
    title="More info"
  >
    ⓘ
  </span>
);

function App() {
  // ── LOCAL DATE ───────────────────────────────────────────────────────────
  const today = useMemo(() => {
    const d = new Date();
    const Y = d.getFullYear();
    const M = String(d.getMonth() + 1).padStart(2, "0");
    const D = String(d.getDate()).padStart(2, "0");
    return `${Y}-${M}-${D}`;
  }, []);

  // ── SCREENS & PROFILE ────────────────────────────────────────────────────
  const [screen, setScreen] = useState("home");
  const [editingProfile, setEditingProfile] = useState(
    () => localStorage.getItem("onboardingComplete") !== "true"
  );
  const [sex, setSex] = useState(() => localStorage.getItem("sex") || "");
  const [age, setAge] = useState(() => localStorage.getItem("age") || "");
  const [height, setHeight] = useState(
    () => localStorage.getItem("height") || ""
  );
  const [weight, setWeight] = useState(
    () => localStorage.getItem("weight") || ""
  );

  // ── TODAY’S LOGS ────────────────────────────────────────────────────────
  const [steps, setSteps] = useState(
    () => parseInt(localStorage.getItem(`steps-${today}`), 10) || 0
  );
  const [foodLog, setFoodLog] = useState(() => {
    const saved = localStorage.getItem(`foodLog-${today}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [weightLog, setWeightLog] = useState(() => {
    const saved = localStorage.getItem("weightLog");
    return saved ? JSON.parse(saved) : [];
  });

  // ── FOOD EDIT STATE ─────────────────────────────────────────────────────
  const [foodEditingIndex, setFoodEditingIndex] = useState(null);
  const [tempFood, setTempFood] = useState({ name: "", cal: "", prot: "" });

  // ── WEIGHT EDIT STATE ────────────────────────────────────────────────────
  const [weightEditingIndex, setWeightEditingIndex] = useState(null);
  const [tempWeight, setTempWeight] = useState("");

  // ── UNIFIED FOOD LIST ──────────────────────────────────────────────────
  const countFoods = [
    { name: "Apple", cal: 95, prot: 1, type: "count" },
    { name: "Banana", cal: 105, prot: 1.3, type: "count" },
    { name: "Egg", cal: 70, prot: 6, type: "count" },
    { name: "Avocado", cal: 240, prot: 3, type: "count" },
    { name: "Walnut", cal: 26, prot: 0.6, type: "count" },
    { name: "Strawberry", cal: 4, prot: 0.1, type: "count" },
  ];
  const weightFoods = [
    { name: "Chicken breast", calPer100g: 165, protPer100g: 31, type: "weight" },
    { name: "Salmon", calPer100g: 206, protPer100g: 22, type: "weight" },
    { name: "Broccoli", calPer100g: 34, protPer100g: 2.8, type: "weight" },
    { name: "White rice", calPer100g: 130, protPer100g: 2.6, type: "weight" },
    { name: "Brown rice", calPer100g: 112, protPer100g: 2.6, type: "weight" },
    { name: "Spinach", calPer100g: 23, protPer100g: 2.9, type: "weight" },
    { name: "Black beans", calPer100g: 132, protPer100g: 8.9, type: "weight" },
    { name: "Strawberries", calPer100g: 32, protPer100g: 0.7, type: "weight" },
  ];
  const volumeFoods = [
    { name: "Oats (dry)", calPerCup: 307, protPerCup: 11, type: "volume" },
    { name: "Chia seeds", calPerCup: 778, protPerCup: 28, type: "volume" },
    { name: "Peanut butter", calPerCup: 1504, protPerCup: 64, type: "volume" },
    { name: "Honey", calPerCup: 1031, protPerCup: 0, type: "volume" },
    { name: "Maple syrup", calPerCup: 819, protPerCup: 0, type: "volume" },
    { name: "Greek yogurt", calPerCup: 130, protPerCup: 23, type: "volume" },
    { name: "Almond milk", calPerCup: 91, protPerCup: 3.6, type: "volume" },
  ];
  const volumeUnits = [
    { label: "Cups", factor: 1 },
    { label: "Tbsp", factor: 1 / 16 },
    { label: "Tsp", factor: 1 / 48 },
  ];

  const unifiedFoods = useMemo(
    () => [...countFoods, ...weightFoods, ...volumeFoods],
    []
  );

  // ── NEW FOOD‐LOGGING UI STATE ──────────────────────────────────────────
  const [searchFood, setSearchFood] = useState("");
  const [selectedFood, setSelectedFood] = useState(null);
  const [measureValue, setMeasureValue] = useState("");
  const [measureUnit, setMeasureUnit] = useState("Cups");

  // ── CUSTOM FOOD ENTRY ───────────────────────────────────────────────────
  const [customName, setCustomName] = useState("");
  const [customCal, setCustomCal] = useState("");
  const [customProt, setCustomProt] = useState("");

  // ── CALCULATIONS ─────────────────────────────────────────────────────────
  const calsToday = useMemo(
    () => foodLog.reduce((sum, f) => sum + f.cal, 0),
    [foodLog]
  );
  const proteinToday = useMemo(
    () => foodLog.reduce((sum, f) => sum + f.prot, 0),
    [foodLog]
  );
  const caloriesFromSteps = Math.round(steps * 0.04);

  function bmr() {
    const h = parseInt(height, 10),
      w = parseFloat(weight),
      a = parseInt(age, 10);
    if (!h || !w || !a) return 1600;
    const heightCm = h * 2.54,
      weightKg = w * 0.453592;
    return Math.round(
      sex === "male"
        ? 10 * weightKg + 6.25 * heightCm - 5 * a + 5
        : 10 * weightKg + 6.25 * heightCm - 5 * a - 161
    );
  }

  const calorieGoal = bmr() - 500 + caloriesFromSteps;
  const wNum = parseFloat(weight);
  const proteinGoal = Number.isFinite(wNum) ? Math.round(wNum * 0.8) : 0;

  // ── PERSIST → LOCALSTORAGE ───────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem("sex", sex);
    localStorage.setItem("age", age);
    localStorage.setItem("height", height);
    localStorage.setItem("weight", weight);
  }, [sex, age, height, weight]);

  useEffect(() => {
    localStorage.setItem(`foodLog-${today}`, JSON.stringify(foodLog));
  }, [foodLog, today]);

  useEffect(() => {
    localStorage.setItem(`steps-${today}`, steps.toString());
  }, [steps, today]);

  useEffect(() => {
    localStorage.setItem("weightLog", JSON.stringify(weightLog));
  }, [weightLog]);

  // ── HANDLERS ────────────────────────────────────────────────────────────
  const finishOnboarding = () => {
    localStorage.setItem("onboardingComplete", "true");
    setEditingProfile(false);
  };

  const handleAddFood = () => {
    if (!selectedFood || !measureValue) return;
    let cal = 0,
      prot = 0,
      name = "";
    const val = +measureValue;

    if (selectedFood.type === "count") {
      cal = selectedFood.cal * val;
      prot = selectedFood.prot * val;
      name = `${val}× ${selectedFood.name}`;
    } else if (selectedFood.type === "weight") {
      const factor = val / 100;
      cal = selectedFood.calPer100g * factor;
      prot = selectedFood.protPer100g * factor;
      name = `${val} g ${selectedFood.name}`;
    } else if (selectedFood.type === "volume") {
      const unit = volumeUnits.find((u) => u.label === measureUnit) || {
        factor: 1,
      };
      const factor = unit.factor * val;
      cal = selectedFood.calPerCup * factor;
      prot = selectedFood.protPerCup * factor;
      name = `${val} ${measureUnit} ${selectedFood.name}`;
    }

    setFoodLog((f) => [
      ...f,
      { name, cal: parseFloat(cal.toFixed(1)), prot: parseFloat(prot.toFixed(1)) },
    ]);

    // clear inputs + haptic
    setMeasureValue("");
    setSelectedFood(null);
    setSearchFood("");
    if (navigator.vibrate) navigator.vibrate(10);
  };

  const addCustomFood = () => {
    const cals = parseFloat(customCal);
    const pro = parseFloat(customProt) || 0;
    if (!customName || isNaN(cals)) {
      alert("Enter name and valid calories.");
      return;
    }
    setFoodLog((f) => [
      ...f,
      { name: customName, cal: cals, prot: pro },
    ]);
    setCustomName("");
    setCustomCal("");
    setCustomProt("");
    if (navigator.vibrate) navigator.vibrate(10);
  };

  const startEditFood = (i) => {
    setFoodEditingIndex(i);
    setTempFood(foodLog[i]);
  };
  const saveEditFood = (i) => {
    setFoodLog((f) =>
      f.map((it, idx) =>
        idx === i
          ? { name: tempFood.name, cal: +tempFood.cal, prot: +tempFood.prot }
          : it
      )
    );
    setFoodEditingIndex(null);
    if (navigator.vibrate) navigator.vibrate(10);
  };
  const cancelEditFood = () => setFoodEditingIndex(null);
  const removeFood = (i) =>
    setFoodLog((f) => f.filter((_, idx) => idx !== i));

  const addWeightLog = () => {
    const w = parseFloat(tempWeight);
    if (!isNaN(w)) {
      setWeightLog((prev) => [
        ...prev,
        { date: today, weight: w },
      ]);
      setTempWeight("");
      if (navigator.vibrate) navigator.vibrate(10);
    }
  };
  const startEditWeight = (i) => {
    setWeightEditingIndex(i);
    setTempWeight(weightLog[i].weight.toString());
  };
  const saveEditWeight = (i) => {
    setWeightLog((w) =>
      w.map((e, idx) =>
        idx === i ? { ...e, weight: parseFloat(tempWeight) } : e
      )
    );
    setWeightEditingIndex(null);
    if (navigator.vibrate) navigator.vibrate(10);
  };
  const cancelEditWeight = () => setWeightEditingIndex(null);
  const deleteWeight = (i) =>
    setWeightLog((w) => w.filter((_, idx) => idx !== i));

  const resetDay = () => {
    setFoodLog([]);
    setSteps(0);
    localStorage.removeItem(`foodLog-${today}`);
    localStorage.removeItem(`steps-${today}`);
  };

  // ── CHART DATA (memoized) ────────────────────────────────────────────────
  const graphData = useMemo(
    () => ({
      labels: weightLog.map((w) => w.date),
      datasets: [
        {
          label: "Weight (lbs)",
          data: weightLog.map((w) => w.weight),
          fill: false,
          borderColor: "blue",
          tension: 0.1,
        },
      ],
    }),
    [weightLog]
  );

  const navBtnStyle = (active) => ({
    flex: 1,
    padding: 10,
    fontSize: 16,
    background: "none",
    border: "none",
    fontWeight: active ? "bold" : "normal",
    cursor: "pointer",
  });

  // ── RENDER ─────────────────────────────────────────────────────────────
  if (editingProfile) {
    return (
      <div style={{ padding: 24 }}>
        <h2>The 500 Plan</h2>
        <p>Track food. Hit your goals. Lose a pound a week.</p>
        <label>
          Sex:{" "}
          <select value={sex} onChange={(e) => setSex(e.target.value)}>
            <option>male</option>
            <option>female</option>
          </select>
        </label>
        <br />
        <label>Age: <input value={age} onChange={(e) => setAge(e.target.value)} /></label><br/>
        <label>Height (in): <input value={height} onChange={(e) => setHeight(e.target.value)} /></label><br/>
        <label>Weight (lbs): <input value={weight} onChange={(e) => setWeight(e.target.value)} /></label><br/>
        <button onClick={finishOnboarding}>Save & Start</button>
      </div>
    );
  }

  return (
    <div style={{ padding:24, paddingBottom:80, maxWidth:500, margin:"auto", fontFamily:"sans-serif" }}>
      <div style={{ display:"flex", justifyContent:"space-between" }}>
        <h2>The 500 Plan</h2>
        <button
          onClick={() => {
            localStorage.removeItem("onboardingComplete");
            setEditingProfile(true);
          }}
        >
          ⚙️
        </button>
      </div>

      {screen === "home" && (
        <>
          <h3>
            Calories
            <InfoButton message={
              "Your BMR (Basal Metabolic Rate) is the number of calories your body burns at rest—basically, what you’d burn if you spent all day in bed. We subtract 500 kcal from your BMR to create a safe, sustainable daily deficit that leads to about one pound of fat loss per week."
            }/>
          </h3>
          <ProgressBar
            value={calsToday}
            goal={calorieGoal}
            color="#2196f3"
            label={`${calsToday} / ${calorieGoal} kcal`}
          />

          <h3>
            Protein
            <InfoButton message={
              "Protein is the building block for muscles, organs, and even your skin and hair. When you’re in a calorie deficit, getting enough protein helps preserve lean muscle mass and keeps you feeling full. We recommend resistance training alongside the 500 Plan so that the calories you do eat go toward maintaining and building muscle."
            }/>
          </h3>
          <ProgressBar
            value={proteinToday}
            goal={proteinGoal}
            color="#4caf50"
            label={`${proteinToday} / ${proteinGoal} g`}
          />

          <h3>
            Steps
            <InfoButton message={
              "Walking is one of the easiest ways to burn extra calories without draining your energy. A target of 10,000 steps adds roughly 300–500 cal of burn per day—making your overall deficit that much more attainable and giving your metabolism a gentle boost."
            }/>
          </h3>
          <ProgressBar value={steps} goal={10000} color="#ff9800" />
          <input
            value={steps}
            onChange={(e) => setSteps(Math.max(0, +e.target.value))}
          />
          <p>+{caloriesFromSteps} cal from steps</p>
          <button
            onClick={resetDay}
            style={{ marginTop:10, background:"#000", color:"#fff", padding:10, borderRadius:5 }}
          >
            🔄 Reset Day
          </button>
        </>
      )}

      {screen === "food" && (
        <>
          <h3>
            Track Food
            <InfoButton message={
              "Choose from our curated list of ‘fat-loss friendly’ foods, pick how you’re measuring it, and hit Add. If it’s not on the list, use Custom Entry at the bottom."
            }/>
          </h3>
          <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:12 }}>
            <input
              placeholder="Search…"
              value={searchFood}
              onChange={e => setSearchFood(e.target.value)}
            />
            <select
              value={selectedFood?.name || ""}
              onChange={e => {
                const f = unifiedFoods.find(x => x.name===e.target.value);
                setSelectedFood(f || null);
                setMeasureValue("");
              }}
            >
              <option value="">Select food</option>
              {unifiedFoods
                .filter(f => f.name.toLowerCase().includes(searchFood.toLowerCase()))
                .map((f,i) => <option key={i}>{f.name}</option>)}
            </select>

            {selectedFood?.type === "volume" && (
              <select
                value={measureUnit}
                onChange={e=>setMeasureUnit(e.target.value)}
              >
                {volumeUnits.map(u=> <option key={u.label}>{u.label}</option>)}
              </select>
            )}

            <input
              type="number"
              placeholder={
                selectedFood?.type==="count"
                  ? "Count"
                  : selectedFood?.type==="weight"
                  ? "g"
                  : selectedFood?.type==="volume"
                  ? "Amount"
                  : "Value"
              }
              value={measureValue}
              onChange={e=>setMeasureValue(e.target.value)}
            />
            <button onClick={handleAddFood}>Add</button>
          </div>

          <h4>Custom Entry</h4>
          <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:12 }}>
            <input
              placeholder="Name"
              value={customName}
              onChange={e=>setCustomName(e.target.value)}
            />
            <input
              placeholder="Calories"
              type="number"
              value={customCal}
              onChange={e=>setCustomCal(e.target.value)}
            />
            <input
              placeholder="Protein"
              type="number"
              value={customProt}
              onChange={e=>setCustomProt(e.target.value)}
            />
            <button onClick={addCustomFood}>Add</button>
          </div>

          <h4>Logged Foods</h4>
          <ul>
            {foodLog.map((it,i)=>(
              <li key={i} style={{ marginBottom:6 }}>
                {foodEditingIndex===i ? (
                  <>
                    <input
                      value={tempFood.name}
                      onChange={e=>setTempFood(t=>({...t,name:e.target.value}))}
                    />
                    <input
                      value={tempFood.cal}
                      type="number"
                      onChange={e=>setTempFood(t=>({...t,cal:e.target.value}))}
                    />
                    <input
                      value={tempFood.prot}
                      type="number"
                      onChange={e=>setTempFood(t=>({...t,prot:e.target.value}))}
                    />
                    <button onClick={()=>saveEditFood(i)}>Save</button>
                    <button onClick={cancelEditFood}>Cancel</button>
                  </>
                ) : (
                  <>
                    {it.name} — {it.cal.toFixed(1)} kcal / {it.prot.toFixed(1)}g protein{" "}
                    <button onClick={()=>startEditFood(i)}>✏️</button>{" "}
                    <button onClick={()=>removeFood(i)}>✖️</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      {screen === "weight" && (
        <>
          <h3>Track Weight</h3>
          {weightEditingIndex!==null ? (
            <>
              <input value={tempWeight} onChange={e=>setTempWeight(e.target.value)} />
              <button onClick={()=>saveEditWeight(weightEditingIndex)}>Save</button>
              <button onClick={cancelEditWeight}>Cancel</button>
            </>
          ) : (
            <>
              <input
                placeholder="Today's weight"
                value={tempWeight}
                onChange={e=>setTempWeight(e.target.value)}
              />
              <button onClick={addWeightLog}>Log</button>
            </>
          )}
          <Line data={graphData} />
          <ul>
            {weightLog.map((w,i)=>(
              <li key={i} style={{ marginBottom:6 }}>
                {weightEditingIndex===i ? null : (
                  <>
                    {w.date}: {w.weight} lb{" "}
                    <button onClick={()=>startEditWeight(i)}>✏️</button>{" "}
                    <button onClick={()=>deleteWeight(i)}>✖️</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      <div style={{
        position:"fixed", bottom:0, left:0, right:0,
        display:"flex", justifyContent:"space-around",
        background:"#fff", borderTop:"1px solid #ccc", height:60, boxShadow:"0 -1px 5px rgba(0,0,0,0.1)"
      }}>
        <button style={navBtnStyle(screen==="home")} onClick={()=>setScreen("home")}>🏠 Home</button>
        <button style={navBtnStyle(screen==="food")} onClick={()=>setScreen("food")}>🍽️ Food</button>
        <button style={navBtnStyle(screen==="weight")} onClick={()=>setScreen("weight")}>⚖️ Weight</button>
      </div>
    </div>
  );
}

// ── PROGRESS BAR COMPONENT ─────────────────────────────────────────────────
const ProgressBar = ({ value, goal, color, label }) => (
  <>
    <div style={{ height: 20, background: "#eee", borderRadius:
