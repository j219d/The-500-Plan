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

// ── Info button ──────────────────────────────────────────────────────────
const InfoButton = ({ message }) => (
  <span
    onClick={() => alert(message)}
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

// ── Progress bar ─────────────────────────────────────────────────────────
const ProgressBar = ({ value, goal, color, label }) => (
  <>
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
          transition: "width 0.3s ease",
        }}
      />
    </div>
    {label && <p>{label}</p>}
  </>
);

// ── Bottom nav button style ──────────────────────────────────────────────
const navBtnStyle = (active) => ({
  flex: 1,
  padding: 10,
  fontSize: 16,
  background: "none",
  border: "none",
  fontWeight: active ? "bold" : "normal",
  cursor: "pointer",
});

// ── Predefined foods & units ─────────────────────────────────────────────
const countFoods = [
  { name: "Apple", cal: 95, prot: 1 },
  { name: "Banana", cal: 105, prot: 1.3 },
  { name: "Egg", cal: 70, prot: 6 },
  { name: "Avocado", cal: 240, prot: 3 },
  { name: "Walnut", cal: 26, prot: 0.6 },
  { name: "Strawberry", cal: 4, prot: 0.1 },
];
const weightFoods = [
  { name: "Chicken breast", calPer100g: 165, protPer100g: 31 },
  { name: "Salmon", calPer100g: 206, protPer100g: 22 },
  { name: "Broccoli", calPer100g: 34, protPer100g: 2.8 },
  { name: "White rice", calPer100g: 130, protPer100g: 2.6 },
  { name: "Brown rice", calPer100g: 112, protPer100g: 2.6 },
  { name: "Spinach", calPer100g: 23, protPer100g: 2.9 },
  { name: "Black beans", calPer100g: 132, protPer100g: 8.9 },
  { name: "Strawberries", calPer100g: 32, protPer100g: 0.7 },
];
const volumeFoods = [
  { name: "Oats (dry)", calPerCup: 307, protPerCup: 11 },
  { name: "Chia seeds", calPerCup: 778, protPerCup: 28 },
  { name: "Peanut butter", calPerCup: 1504, protPerCup: 64 },
  { name: "Honey", calPerCup: 1031, protPerCup: 0 },
  { name: "Maple syrup", calPerCup: 819, protPerCup: 0 },
  { name: "Greek yogurt", calPerCup: 130, protPerCup: 23 },
  { name: "Almond milk", calPerCup: 91, protPerCup: 3.6 },
];
const volumeUnits = [
  { label: "Cups", factor: 1 },
  { label: "Tbsp", factor: 1 / 16 },
  { label: "Tsp", factor: 1 / 48 },
];

// ── Unified FoodLogger ───────────────────────────────────────────────────
function FoodLogger({ foodLog, setFoodLog }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [measurementType, setMeasurementType] = useState("count");
  const [unit, setUnit] = useState("Cups");
  const [value, setValue] = useState("");
  const [selectedFood, setSelectedFood] = useState(null);

  const options =
    measurementType === "count"
      ? countFoods
      : measurementType === "weight"
      ? weightFoods
      : volumeFoods;
  const filtered = options.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const match = options.find((f) => f.name === searchTerm);
    setSelectedFood(match || null);
  }, [searchTerm, options]);

  const handleAdd = () => {
    if (!selectedFood || !value) return;
    const amt = parseFloat(value);
    let cal = 0,
      prot = 0;

    if (measurementType === "count") {
      cal = selectedFood.cal * amt;
      prot = selectedFood.prot * amt;
    } else if (measurementType === "weight") {
      const factor = amt / 100;
      cal = selectedFood.calPer100g * factor;
      prot = selectedFood.protPer100g * factor;
    } else {
      const unitObj = volumeUnits.find((u) => u.label === unit);
      const factor = unitObj.factor * amt;
      cal = selectedFood.calPerCup * factor;
      prot = selectedFood.protPerCup * factor;
    }

    setFoodLog((f) => [
      ...f,
      {
        name: `${value}${
          measurementType === "count" ? "× " : " "
        }${selectedFood.name}${
          measurementType === "volume" ? " " + unit : ""
        }`,
        cal,
        prot,
      },
    ]);
    setSearchTerm("");
    setValue("");
  };

  return (
    <div>
      <h4>
        Log Food
        <InfoButton
          message="Quickly log everything you eat—search or select a food, choose count, weight, or volume, enter the amount, and hit Add. Consistent logging helps you stay on track with your daily calorie and protein goals."
        />
      </h4>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          list="food-options"
          placeholder="Search / select food…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1 }}
        />
        <select
          value={measurementType}
          onChange={(e) => {
            setMeasurementType(e.target.value);
            setUnit("Cups");
            setSearchTerm("");
            setValue("");
          }}
        >
          <option value="count">Count</option>
          <option value="weight">Weight (g)</option>
          <option value="volume">Volume</option>
        </select>

        {measurementType === "volume" && (
          <select value={unit} onChange={(e) => setUnit(e.target.value)}>
            {volumeUnits.map((u) => (
              <option key={u.label}>{u.label}</option>
            ))}
          </select>
        )}

        <input
          type="number"
          placeholder="Amt"
          style={{ width: 60 }}
          value={value}
          onChange={(e) => setValue(Math.max(0, +e.target.value))}
        />

        <button onClick={handleAdd}>Add</button>
      </div>

      <datalist id="food-options">
        {filtered.map((f, i) => (
          <option key={i} value={f.name} />
        ))}
      </datalist>
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────
export default function App() {
  const today = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  })();

  // Screens & profile
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
  const [darkMode, setDarkMode] = useState(false);

  // Today's logs
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

  // Weight editing state
  const [weightEditingIndex, setWeightEditingIndex] = useState(null);
  const [tempWeight, setTempWeight] = useState("");

  // Custom entry
  const [customName, setCustomName] = useState("");
  const [customCal, setCustomCal] = useState("");
  const [customProt, setCustomProt] = useState("");

  // Calculations
  const calsToday = foodLog.reduce((sum, f) => sum + f.cal, 0);
  const proteinToday = foodLog.reduce((sum, f) => sum + f.prot, 0);
  const caloriesFromSteps = Math.round(steps * 0.04);
  const bmr = () => {
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
  };
  const calorieGoal = bmr() - 500 + caloriesFromSteps;
  const wNum = parseFloat(weight);
  const proteinGoal = Number.isFinite(wNum) ? Math.round(wNum * 0.8) : 0;

  // Persist
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

  // Handlers
  const finishOnboarding = () => {
    localStorage.setItem("onboardingComplete", "true");
    setEditingProfile(false);
  };
  const addCustomFood = () => {
    const cals = parseFloat(customCal);
    const pro = parseFloat(customProt) || 0;
    if (!customName || isNaN(cals)) {
      alert("Enter name and valid calories.");
      return;
    }
    setFoodLog((f) => [...f, { name: customName, cal: cals, prot: pro }]);
    setCustomName("");
    setCustomCal("");
    setCustomProt("");
  };
  const addWeightLog = () => {
    const w = parseFloat(tempWeight);
    if (!isNaN(w)) {
      setWeightLog((prev) => [...prev, { date: today, weight: w }]);
      setTempWeight("");
    }
  };
  const saveEditWeight = (i) => {
    setWeightLog((w) =>
      w.map((e, idx) =>
        idx === i ? { ...e, weight: parseFloat(tempWeight) } : e
      )
    );
    setWeightEditingIndex(null);
  };
  const deleteWeight = (i) =>
    setWeightLog((w) => w.filter((_, idx) => idx !== i));

  const handleResetDay = () => {
    if (
      window.confirm(
        "Reset all of today’s steps and food logs? This cannot be undone."
      )
    ) {
      setFoodLog([]);
      setSteps(0);
      localStorage.removeItem(`foodLog-${today}`);
      localStorage.removeItem(`steps-${today}`);
    }
  };

  if (editingProfile) {
    return (
      <div
        style={{
          padding: 24,
          background: darkMode ? "#121212" : "#fff",
          color: darkMode ? "#eee" : "#000",
        }}
      >
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
        <label>
          Age: <input value={age} onChange={(e) => setAge(e.target.value)} />
        </label>
        <br />
        <label>
          Height (in):{" "}
          <input
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </label>
        <br />
        <label>
          Weight (lbs):{" "}
          <input
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </label>
        <br />
        <button onClick={finishOnboarding}>Save &amp; Start</button>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 24,
        paddingBottom: 80,
        maxWidth: 500,
        margin: "auto",
        fontFamily: "sans-serif",
        background: darkMode ? "#121212" : "#fff",
        color: darkMode ? "#eee" : "#000",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>The 500 Plan</h2>
        <div>
          <button
            onClick={() => setDarkMode((dm) => !dm)}
            style={{ marginRight: 8 }}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("onboardingComplete");
              setEditingProfile(true);
            }}
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* Home */}
      {screen === "home" && (
        <>
          <h3>
            Calories
            <InfoButton message="Your BMR (Basal Metabolic Rate) is the number of calories your body burns at rest—basically, what you’d burn if you spent all day in bed. We subtract 500 kcal from your BMR to create a safe, sustainable daily deficit that leads to about one pound of fat loss per week." />
          </h3>
          <ProgressBar
            value={calsToday}
            goal={calorieGoal}
            color="#2196f3"
            label={`${calsToday} / ${calorieGoal} kcal`}
          />

          <h3>
            Protein
            <InfoButton message="Protein is the building block for muscles, organs, and even your skin and hair. When you’re in a calorie deficit, getting enough protein helps preserve lean muscle mass and keeps you feeling full. We recommend resistance training alongside the 500 Plan so that the calories you do eat go toward maintaining and building muscle." />
          </h3>
          <ProgressBar
            value={proteinToday}
            goal={proteinGoal}
            color="#4caf50"
            label={`${proteinToday} / ${proteinGoal} g`}
          />

          <h3>
            Steps
            <InfoButton message="Walking is one of the easiest ways to burn extra calories without draining your energy. A target of 10,000 steps adds roughly 300–500 cal of burn per day—making your overall deficit that much more attainable and giving your metabolism a gentle boost." />
          </h3>
          <ProgressBar value={steps} goal={10000} color="#ff9800" />
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="0"
            value={steps === 0 ? "" : steps.toString()}
            onChange={(e) => {
              const raw = e.target.value;
              if (/^\d*$/.test(raw)) {
                setSteps(raw === "" ? 0 : parseInt(raw, 10));
              }
            }}
            style={{ width: 80 }}
          />
          <p>+{caloriesFromSteps} cal from steps</p>
        </>
      )}

      {/* Food */}
      {screen === "food" && (
        <>
          <FoodLogger foodLog={foodLog} setFoodLog={setFoodLog} />

          <h4>Custom Entry</h4>
          <input
            placeholder="Name"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
          />
          <input
            placeholder="Calories"
            type="number"
            value={customCal}
            onChange={(e) => setCustomCal(Math.max(0, +e.target.value))}
          />
          <input
            placeholder="Protein"
            type="number"
            value={customProt}
            onChange={(e) => setCustomProt(Math.max(0, +e.target.value))}
          />
          <button onClick={addCustomFood}>Add</button>

          <h4>Logged Foods</h4>
          <ul>
            {foodLog.map((it, i) => (
              <li
                key={i}
                onContextMenu={(e) => {
                  e.preventDefault();
                  const choice = window.prompt(
                    "Type 'e' to edit or 'd' to delete."
                  );
                  if (choice === "d") {
                    setFoodLog((f) => f.filter((_, idx) => idx !== i));
                  } else if (choice === "e") {
                    const newName = window.prompt("New name:", it.name);
                    const newCal = window.prompt("New calories:", it.cal);
                    const newProt = window.prompt(
                      "New protein:",
                      it.prot
                    );
                    if (
                      newName !== null &&
                      newCal !== null &&
                      newProt !== null
                    ) {
                      setFoodLog((f) =>
                        f.map((item, idx) =>
                          idx === i
                            ? {
                                name: newName,
                                cal: parseFloat(newCal),
                                prot: parseFloat(newProt),
                              }
                            : item
                        )
                      );
                    }
                  }
                }}
                style={{ marginBottom: 6, cursor: "context-menu" }}
              >
                {it.name} — {it.cal.toFixed(1)} kcal /{" "}
                {it.prot.toFixed(1)}g protein
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Weight */}
      {screen === "weight" && (
        <>
          <h3>Track Weight</h3>
          {weightEditingIndex !== null ? (
            <>
              <input
                value={tempWeight}
                onChange={(e) => setTempWeight(e.target.value)}
              />
              <button onClick={() => saveEditWeight(weightEditingIndex)}>
                Save
              </button>
              <button onClick={() => setWeightEditingIndex(null)}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <input
                placeholder="Today's weight"
                value={tempWeight}
                onChange={(e) => setTempWeight(e.target.value)}
              />
              <button onClick={addWeightLog}>Log</button>
            </>
          )}
          <Line
            data={{
              labels: weightLog.map((w) => w.date),
              datasets: [
                {
                  label: "Weight (lbs)",
                  data: weightLog.map((w) => w.weight),
                  fill: false,
                  tension: 0.1,
                },
              ],
            }}
          />
          <ul>
            {weightLog.map((w, i) => (
              <li key={i} style={{ marginBottom: 6 }}>
                {w.date}: {w.weight} lb{" "}
                <button onClick={() => {
                  setWeightEditingIndex(i);
                  setTempWeight(w.weight.toString());
                }}>
                  ✏️
                </button>{" "}
                <button onClick={() => deleteWeight(i)}>✖️</button>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Bottom nav */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-around",
          background: "#fff",
          borderTop: "1px solid #ccc",
          height: 60,
          boxShadow: "0 -1px 5px rgba(0,0,0,0.1)",
        }}
      >
        <button
          style={navBtnStyle(screen === "home")}
          onClick={() => setScreen("home")}
        >
          🏠 Home
        </button>
        <button
          style={navBtnStyle(screen === "food")}
          onClick={() => setScreen("food")}
        >
          🍽️ Food
        </button>
        <button
          style={navBtnStyle(screen === "weight")}
          onClick={() => setScreen("weight")}
        >
          ⚖️ Weight
        </button>
        <button
          style={navBtnStyle(false)}
          onClick={handleResetDay}
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
}
