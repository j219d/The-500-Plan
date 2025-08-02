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

export const presetFoods = [
  "Almond Milk (1/4 cup) - 23 kcal / 0.9g protein",
  "Almond Milk (1/2 cup) - 46 kcal / 1.8g protein",
  "Almond Milk (3/4 cup) - 68 kcal / 2.7g protein",
  "Almond Milk (1 cup) - 91 kcal / 3.6g protein",
  "Apple - 95 kcal / 1g protein",
  "Asparagus (cooked, 50g) - 10 kcal / 1.1g protein",
  "Asparagus (cooked, 75g) - 15 kcal / 1.7g protein",
  "Asparagus (cooked, 100g) - 20 kcal / 2.2g protein",
  "Asparagus (cooked, 150g) - 30 kcal / 3.3g protein",
  "Avocado (half) - 120 kcal / 1.5g protein",
  "Avocado (whole) - 240 kcal / 3g protein",
  "Banana (half) - 53 kcal / 0.6g protein",
  "Banana (whole) - 105 kcal / 1.3g protein",
  "Blueberries (½ cup) - 42 kcal / 0.6g protein",
  "Blueberries (1 cup) - 84 kcal / 1.1g protein",
  "Brazil nut - 33 kcal / 0.75g protein",
  "Bread (sourdough rye slice 56g) - 145 kcal / 4.5g protein",
  "Butter (1 tsp) - 35 kcal / 0g protein",
  "Butter (½ tbsp) - 51 kcal / 0.05g protein",
  "Butter (1 tbsp) - 102 kcal / 0.1g protein",
  "Carrot (50g) - 21 kcal / 0.5g protein",
  "Carrot (100g) - 41 kcal / 0.9g protein",
  "Carrot (150g) - 62 kcal / 1.4g protein",
  "Carrots Peas and Corn (frozen, 100g) - 63 kcal / 3g protein",
  "Chia pudding (2 tbsp chia + 3/4 cup almond milk) - 206 kcal / 5g protein",
  "Chia seeds (1 tbsp) - 58 kcal / 2g protein",
  "Chicken breast (50g) - 82 kcal / 15g protein",
  "Chicken breast (100g) - 165 kcal / 31g protein",
  "Chicken breast (130g) - 215 kcal / 40g protein",
  "Chicken breast (150g) - 248 kcal / 46g protein",
  "Chicken breast (160g) - 264 kcal / 50g protein",
  "Chicken breast (200g) - 330 kcal / 62g protein",
  "Chocolate chips (10g) - 58 kcal / 1g protein",
  "Corn (100g) - 85 kcal / 2.2g protein",  
  "Cottage cheese 5% (50g) - 48 kcal / 5.5g protein",
  "Cottage cheese 5% (100g) - 95 kcal / 11g protein",
  "Cottage cheese 5% (250g full tub) - 238 kcal / 27.5g protein",
  "Cucumber - 16 kcal / 1g protein",
  "Date (1 Medjool) - 66 kcal / 0.4g protein",
  "Egg - 70 kcal / 6g protein",
  "Egg white - 15 kcal / 3g protein",
  "Eggs (2) + butter - 175 kcal / 12g protein",
  "Eggs (2), Egg white (1) + butter - 190 kcal / 15g protein",
  "Fig (1 medium) - 37 kcal / 0.4g protein",
  "Flax seeds (1 tbsp) - 55 kcal / 2g protein",
  "Green onions - 5 kcal / 0g protein",
  "Green beans (100g, roasted, no oil) - 38 kcal / 2.2g protein",
  "Ground beef 90/10 (100g) - 145 kcal / 18.6g protein",
  "Honey (1 tbsp) - 45 kcal / 0g protein",
  "Hummus (100g) - 170 kcal / 7g protein",
  "Israeli salad (medium) - 70 kcal / 1.5g protein",
  "Lychee (10 fruits) - 60 kcal / 1.0g protein",
  "Mac n' Cheese (½ box of Goodles) - 338 kcal / 19g protein",
  "Maple syrup (1 tbsp) - 52 kcal / 0g protein",
  "Oats (½ cup) - 146 kcal / 4.8g protein",
  "Olive oil (1 tbsp) - 120 kcal / 0g protein",
  "Oreo (2 cookies) - 104 kcal / 0.7g protein",
  "Parmesan cheese (25g) - 101 kcal / 8.0g protein",
  "Peanut butter (1 tbsp) - 94 kcal / 4g protein",
  "Peas (frozen, 100g) - 73 kcal / 6.9g protein",
  "Pita (full) - 275 kcal / 9.1g protein",
  "Potato (100g) - 86 kcal / 2g protein",
  "Protein bar (quest cookie dough) - 190 kcal / 21g protein",
  "Protein scoop (1 Promix Chocolate) - 80 kcal / 15.5g protein",
  "Rice (100g cooked) - 130 kcal / 2.6g protein",
  "Salmon (100g) - 206 kcal / 22g protein",
  "Spinach (frozen, 100g) - 28 kcal / 3.2g protein",
  "Strawberries (1 cup) - 49 kcal / 1g protein",
  "Sweet potato (100g) - 86 kcal / 2g protein",
  "Tomato - 20 kcal / 1g protein",
  "Tuna (150g) - 156 kcal / 37.2g protein",
  "Yogurt 0% - 117 kcal / 20g protein",
];

// Modal for info text
const InfoModal = ({ text, onClose }) => (
  <div
    style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10,
    }}
  >
    <div
      style={{
        background: "#fff",
        padding: 20,
        borderRadius: 8,
        maxWidth: 320,
        textAlign: "left",
      }}
    >
      <p style={{ marginBottom: 12 }}>{text}</p>
      <button onClick={onClose} style={{ padding: "6px 12px" }}>
        Close
      </button>
    </div>
  </div>
);

// Simple progress bar
const ProgressBar = ({ value, goal, color, label }) => (
  <div style={{ marginBottom: 12 }}>
    <div
      style={{
        height: 20,
        background: "#eee",
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${Math.min((value / goal) * 100, 100)}%`,
          background: color,
          height: "100%",
          transition: "width 0.3s",
        }}
      />
    </div>
    {label && <p style={{ margin: "4px 0" }}>{label}</p>}
  </div>
);

const navBtnStyle = (active) => ({
  flex: 1, padding: 10, fontSize: 16,
  background: "none", border: "none",
  fontWeight: active ? "bold" : "normal",
  cursor: "pointer",
});

function App() {
  // ── LOCAL DATE ───────────────────────────────────────────────────────────
  const today = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  })();

  // ── NAV / ONBOARDING ─────────────────────────────────────────────────────
  const [screen, setScreen] = useState("home");
  const [editingProfile, setEditingProfile] = useState(
    () => localStorage.getItem("onboardingComplete") !== "true"
  );

  // ── PROFILE ─────────────────────────────────────────────────────────────
  const [sex, setSex] = useState(() => localStorage.getItem("sex") || "");
  const [age, setAge] = useState(() => localStorage.getItem("age") || "");
  const [height, setHeight] = useState(() => localStorage.getItem("height") || "");
  const [weight, setWeight] = useState(() => localStorage.getItem("weight") || "");

  // ── TODAY’S LOGS ────────────────────────────────────────────────────────
  const [steps, setSteps] = useState(() => parseInt(localStorage.getItem(`steps-${today}`),10) || 0);
  const [foodLog, setFoodLog] = useState(() => {
    const saved = localStorage.getItem(`foodLog-${today}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [weightLog, setWeightLog] = useState(() => {
    const saved = localStorage.getItem("weightLog");
    return saved ? JSON.parse(saved) : [];
  });

  // ── EDIT STATE ──────────────────────────────────────────────────────────
  const [foodEditingIndex, setFoodEditingIndex] = useState(null);
  const [tempFood, setTempFood] = useState({ name: "", cal: "", prot: "" });
  const [weightEditingIndex, setWeightEditingIndex] = useState(null);
  const [tempWeight, setTempWeight] = useState("");

  // ── INFO MODAL ──────────────────────────────────────────────────────────
  const [infoType, setInfoType] = useState(null);
  const infoTexts = {
    calories:
      "Your BMR (Basal Metabolic Rate) is the number of calories your body burns at rest—what you'd burn lying in bed all day. We subtract 500 kcal from your BMR to create a safe daily deficit, leading to about one pound of fat loss per week.",
    protein:
      "Protein helps build and preserve muscle, keeps you full, and supports metabolism. When dieting, getting enough protein prevents muscle loss—especially if you add resistance training alongside the 500 Plan.",
    steps:
      "Walking burns extra calories without overly fatiguing you. Aiming for 10,000 steps/day adds ~300–500 kcal of burn—making your overall deficit easier to hit and boosting your metabolism gently.",
  };

  // ── FOOD SEARCH & CUSTOM ─────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [foodList, setFoodList] = useState([]);
  const [customName, setCustomName] = useState("");
  const [customCal, setCustomCal] = useState("");
  const [customProt, setCustomProt] = useState("");

  // ── CALCULATIONS ─────────────────────────────────────────────────────────
  const calsToday = foodLog.reduce((sum, f) => sum + f.cal, 0);
  const proteinToday = foodLog.reduce((sum, f) => sum + f.prot, 0);
  const caloriesFromSteps = Math.round(steps * 0.04);

  function bmr() {
    const h = parseInt(height,10), w = parseFloat(weight), a = parseInt(age,10);
    if (!h||!w||!a) return 1600;
    const heightCm = h*2.54, weightKg = w*0.453592;
    return Math.round(
      sex==="male"
        ? 10*weightKg + 6.25*heightCm - 5*a + 5
        : 10*weightKg + 6.25*heightCm - 5*a -161
    );
  }
  const calorieGoal = bmr() - 500 + caloriesFromSteps;
  const wNum = parseFloat(weight);
  const proteinGoal = Number.isFinite(wNum) ? Math.round(wNum*0.8) : 0;

  // ── PERSIST ─────────────────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem("sex", sex);
    localStorage.setItem("age", age);
    localStorage.setItem("height", height);
    localStorage.setItem("weight", weight);
  }, [sex, age, height, weight]);
  useEffect(() => {
    localStorage.setItem(`foodLog-${today}`, JSON.stringify(foodLog));
  }, [foodLog]);
  useEffect(() => {
    localStorage.setItem(`steps-${today}`, steps.toString());
  }, [steps]);
  useEffect(() => {
    localStorage.setItem("weightLog", JSON.stringify(weightLog));
  }, [weightLog]);

  // ── LIVE SEARCH ─────────────────────────────────────────────────────────
  useEffect(() => {
    const results = presetFoods.filter((f) =>
      f.split(" - ")[0].toLowerCase().includes(search.toLowerCase())
    );
    setFoodList(search.length ? results : []);
  }, [search]);

  // ── HANDLERS ────────────────────────────────────────────────────────────
  const finishOnboarding = () => {
    localStorage.setItem("onboardingComplete", "true");
    setEditingProfile(false);
  };

  const handlePresetSelect = (food) => {
    const [namePart, values] = food.split(" - ");
    const [kcal, prot] = values.replace(/kcal|protein/g,"").split("/");
    setFoodLog((f) => [
      ...f,
      { name: namePart, cal: +kcal.trim(), prot: +prot.trim() },
    ]);
    setSearch("");
    setFoodList([]);
  };

  const addCustomFood = () => {
    const cals = parseFloat(customCal);
    let pro = parseFloat(customProt);
    if (!customName || isNaN(cals)) {
      alert("Enter a name and valid calories.");
      return;
    }
    if (isNaN(pro)) pro = 0;
    setFoodLog((f) => [...f, { name: customName, cal: cals, prot: pro }]);
    setCustomName("");
    setCustomCal("");
    setCustomProt("");
  };

  const startEditFood = (i) => {
    const item = foodLog[i];
    setFoodEditingIndex(i);
    setTempFood({ name: item.name, cal: item.cal, prot: item.prot });
  };
  const saveEditFood = (i) => {
    setFoodLog((f) =>
      f.map((item, idx) =>
        idx===i
          ? { name: tempFood.name, cal: parseFloat(tempFood.cal), prot: parseFloat(tempFood.prot) }
          : item
      )
    );
    setFoodEditingIndex(null);
  };
  const cancelEditFood = () => setFoodEditingIndex(null);
  const removeFood = (i) => setFoodLog((f) => f.filter((_,idx)=>idx!==i));

  const addWeight = () => {
    const w = parseFloat(tempWeight);
    if (!isNaN(w)) {
      setWeightLog((prev) => [...prev, { date: today, weight: w }]);
      setTempWeight("");
    }
  };
  const startEditWeight = (i) => {
    setWeightEditingIndex(i);
    setTempWeight(weightLog[i].weight.toString());
  };
  const saveEditWeight = (i) => {
    setWeightLog((w) =>
      w.map((e,idx)=> idx===i ? { ...e, weight: parseFloat(tempWeight) } : e)
    );
    setWeightEditingIndex(null);
  };
  const cancelEditWeight = () => setWeightEditingIndex(null);
  const deleteWeight = (i) =>
    setWeightLog((w) => w.filter((_,idx)=>idx!==i));

  const resetDay = () => {
    setFoodLog([]);
    setSteps(0);
    localStorage.removeItem(`foodLog-${today}`);
    localStorage.removeItem(`steps-${today}`);
  };

  // ── RENDER ─────────────────────────────────────────────────────────────
  if (editingProfile) {
    return (
      <div style={{ padding: 24 }}>
        <h2>The 500 Plan</h2>
        <p>Track food. Hit your goals. Lose ~1 lb/week.</p>
        <label>
          Sex:{" "}
          <select value={sex} onChange={(e)=>setSex(e.target.value)}>
            <option>male</option><option>female</option>
          </select>
        </label><br/>
        <label>
          Age: <input value={age} onChange={(e)=>setAge(e.target.value)} />
        </label><br/>
        <label>
          Height (in): <input value={height} onChange={(e)=>setHeight(e.target.value)} />
        </label><br/>
        <label>
          Weight (lb): <input value={weight} onChange={(e)=>setWeight(e.target.value)} />
        </label><br/>
        <button onClick={finishOnboarding} style={{ marginTop: 12, padding: "8px 16px" }}>
          Save & Start
        </button>
      </div>
    );
  }

  const graphData = {
    labels: weightLog.map((w)=>w.date),
    datasets: [{
      label: "Weight (lbs)",
      data: weightLog.map((w)=>w.weight),
      fill: false, borderColor: "blue", tension: 0.1,
    }],
  };

  return (
    <div style={{ padding: 24, paddingBottom: 80, maxWidth: 500, margin: "auto", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>The 500 Plan</h2>
        <button onClick={()=>{ localStorage.removeItem("onboardingComplete"); setEditingProfile(true); }}>
          ⚙️
        </button>
      </div>

      {screen === "home" && (
        <>
          <h3 style={{ display: "flex", alignItems: "center" }}>
            Calories
            <button onClick={()=>setInfoType("calories")} style={{ marginLeft: 8, border:"none", background:"none", fontSize:18, cursor:"pointer" }}>ⓘ</button>
          </h3>
          <ProgressBar value={calsToday} goal={calorieGoal} color="#2196f3" label={`${calsToday} / ${calorieGoal} kcal`} />

          <h3 style={{ display: "flex", alignItems: "center" }}>
            Protein
            <button onClick={()=>setInfoType("protein")} style={{ marginLeft: 8, border:"none", background:"none", fontSize:18, cursor:"pointer" }}>ⓘ</button>
          </h3>
          <ProgressBar value={proteinToday} goal={proteinGoal} color="#4caf50" label={`${proteinToday} / ${proteinGoal} g`} />

          <h3 style={{ display: "flex", alignItems: "center" }}>
            Steps
            <button onClick={()=>setInfoType("steps")} style={{ marginLeft: 8, border:"none", background:"none", fontSize:18, cursor:"pointer" }}>ⓘ</button>
          </h3>
          <ProgressBar value={steps} goal={10000} color="#ff9800" />
          <input
            value={steps}
            onChange={(e)=>setSteps(Math.max(0,+e.target.value))}
            style={{ width:"100%", marginBottom:8 }}
          />
          <p>+{caloriesFromSteps} cal from steps</p>

          <button onClick={resetDay} style={{ width:"100%", padding: 10, background:"#000", color:"#fff", border:"none", borderRadius:5, marginTop: 12 }}>
            🔄 Reset Day
          </button>

          {infoType && (
            <InfoModal text={infoTexts[infoType]} onClose={()=>setInfoType(null)} />
          )}
        </>
      )}

      {screen === "food" && (
        <>
          <h3>Food Search</h3>
          <input
            placeholder="Search food…"
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            style={{ width:"100%", marginBottom:8 }}
          />
          {foodList.length>0 && (
            <ul style={{ background:"#f2f2f2", padding:8, borderRadius:4, listStyle:"none", marginBottom:8 }}>
              {foodList.map((f,idx)=>(
                <li
                  key={idx}
                  onClick={()=>handlePresetSelect(f)}
                  style={{ padding:4, cursor:"pointer" }}
                >
                  {f}
                </li>
              ))}
            </ul>
          )}

          <h4>Or Enter Manually</h4>
          <input
            placeholder="Food name"
            value={customName}
            onChange={(e)=>setCustomName(e.target.value)}
            style={{ width:"100%", marginBottom:4 }}
          />
          <input
            placeholder="Calories"
            type="number"
            value={customCal}
            onChange={(e)=>setCustomCal(e.target.value)}
            style={{ width:"100%", marginBottom:4 }}
          />
          <input
            placeholder="Protein"
            type="number"
            value={customProt}
            onChange={(e)=>setCustomProt(e.target.value)}
            style={{ width:"100%", marginBottom:8 }}
          />
          <button onClick={addCustomFood} style={{ padding:"8px 16px", marginBottom:12 }}>
            Add Food
          </button>

          <h4>Logged Foods Today</h4>
          <ul>
            {foodLog.map((item,idx)=>(
              <li key={idx} style={{ marginBottom:6 }}>
                {foodEditingIndex===idx ? (
                  <>
                    <input
                      value={tempFood.name}
                      onChange={(e)=>setTempFood((t)=>({...t,name:e.target.value}))}
                      style={{ marginRight:4 }}
                    />
                    <input
                      value={tempFood.cal}
                      type="number"
                      onChange={(e)=>setTempFood((t)=>({...t,cal:e.target.value}))}
                      style={{ marginRight:4 }}
                    />
                    <input
                      value={tempFood.prot}
                      type="number"
                      onChange={(e)=>setTempFood((t)=>({...t,prot:e.target.value}))}
                      style={{ marginRight:4 }}
                    />
                    <button onClick={()=>saveEditFood(idx)}>Save</button>
                    <button onClick={cancelEditFood} style={{ marginLeft:4 }}>Cancel</button>
                  </>
                ) : (
                  <>
                    {item.name} — {item.cal} kcal / {item.prot}g protein{" "}
                    <button onClick={()=>startEditFood(idx)} style={{ marginLeft:8 }}>✏️</button>
                    <button onClick={()=>removeFood(idx)} style={{ marginLeft:4 }}>✖️</button>
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
              <input
                value={tempWeight}
                onChange={(e)=>setTempWeight(e.target.value)}
                style={{ marginRight:4 }}
              />
              <button onClick={()=>saveEditWeight(weightEditingIndex)}>Save</button>
              <button onClick={cancelEditWeight} style={{ marginLeft:4 }}>Cancel</button>
            </>
          ) : (
            <>
              <input
                placeholder="Today's weight"
                value={tempWeight}
                onChange={(e)=>setTempWeight(e.target.value)}
                style={{ marginRight:4 }}
              />
              <button onClick={addWeight}>Log</button>
            </>
          )}
          <div style={{ marginTop:12, marginBottom:12 }}>
            <Line data={graphData} />
          </div>
          <ul>
            {weightLog.map((w,i)=>(
              <li key={i} style={{ marginBottom:6 }}>
                {weightEditingIndex===i? null : (
                  <>
                    {w.date}: {w.weight} lb{" "}
                    <button onClick={()=>startEditWeight(i)} style={{ marginLeft:8 }}>✏️</button>
                    <button onClick={()=>deleteWeight(i)} style={{ marginLeft:4 }}>✖️</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          borderTop: "1px solid #ccc",
          background: "#fff",
          height: 60,
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <button style={navBtnStyle(screen==="home")} onClick={()=>setScreen("home")}>
          🏠 Home
        </button>
        <button style={navBtnStyle(screen==="food")} onClick={()=>setScreen("food")}>
          🍽️ Food
        </button>
        <button style={navBtnStyle(screen==="weight")} onClick={()=>setScreen("weight")}>
          ⚖️ Weight
        </button>
      </div>
    </div>
  );
}

export default App;
