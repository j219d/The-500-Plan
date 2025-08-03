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

// ── System font stack ─────────────────────────────────────────────────────
const SYSTEM_FONT =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';

// 👉 kcal a single step roughly burns
const CALS_PER_STEP = 0.04;         

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
      fontFamily: SYSTEM_FONT,
    }}
    title="More info"
  >
    ⓘ
  </span>
);

// ── ProgressBar ──────────────────────────────────────────────────────────
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
    {label && <p style={{ fontFamily: SYSTEM_FONT }}>{label}</p>}
  </>
);

// ── CalorieBar ───────────────────────────────────────────────────────────
const CalorieBar = ({ consumed, goal }) => {
  const remaining   = goal - consumed;
  const pct         = Math.max((remaining / goal) * 100, 0);
  const overflowPct = remaining < 0 ? Math.min((-remaining / goal) * 100, 100) : 0;

  // ⇢ new: how many extra steps erase the overage
  const extraSteps  = remaining < 0
    ? Math.ceil((-remaining) / CALS_PER_STEP)
    : 0;

  return (
    <>
      <div
        style={{
          position: "relative",
          height: 20,
          background: "#eee",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            background: "#2196f3",
            height: "100%",
            transition: "width 0.3s ease",
          }}
        />
        {overflowPct > 0 && (
          <div
            style={{
              position: "absolute",
              right: 0,
              width: `${overflowPct}%`,
              background: "#e53935",
              height: "100%",
            }}
          />
        )}
      </div>
      <p style={{ fontFamily: SYSTEM_FONT }}>
        {remaining >= 0
          ? `${remaining.toFixed(0)} kcal remaining`
          : `Over by ${(-remaining).toFixed(0)} kcal — about ${extraSteps.toLocaleString()} extra steps will balance it out`}
      </p>
    </>
  );
};

// ── Bottom nav style ─────────────────────────────────────────────────────
const navBtnStyle = (active) => ({
  flex: 1,
  padding: 10,
  fontSize: 16,
  background: "none",
  border: "none",
  fontWeight: active ? "bold" : "normal",
  cursor: "pointer",
  fontFamily: SYSTEM_FONT,
});

// ── Foods & units ────────────────────────────────────────────────────────
const countFoods = [
  { name: "Apple", cal: 95, prot: 1 },
  { name: "Avocado (half)", cal: 120, prot: 1.5 },
  { name: "Avocado (whole)", cal: 240, prot: 3 },
  { name: "Banana", cal: 105, prot: 1.3 },
  { name: "Bell pepper", cal: 24, prot: 1 },
  { name: "Blueberry", cal: 1, prot: 0 },
  { name: "Bread slice (whole wheat)", cal: 70, prot: 3.6 },
  { name: "Brazil nut", cal: 33, prot: 0.7 },
  { name: "Carrot (medium)", cal: 25, prot: 0.6 },
  { name: "Cherry", cal: 4, prot: 0.1 },
  { name: "Cucumber (medium)", cal: 24, prot: 1 },
  { name: "Egg", cal: 70, prot: 6 },
  { name: "Grape", cal: 3, prot: 0.1 },
  { name: "Kiwi", cal: 42, prot: 0.8 },
  { name: "Mango", cal: 201, prot: 2.8 },
  { name: "Olive (black)", cal: 4, prot: 0.1 },
  { name: "Olive (green)", cal: 5, prot: 0.1 },
  { name: "Orange", cal: 62, prot: 1.2 },
  { name: "Papaya", cal: 119, prot: 0.9 },
  { name: "Pear", cal: 101, prot: 0.6 },
  { name: "Peach", cal: 59, prot: 1.4 },
  { name: "Plum", cal: 30, prot: 0.5 },
  { name: "Raspberry", cal: 1, prot: 0.1 },
  { name: "Strawberry", cal: 4, prot: 0.1 },
  { name: "Tomato", cal: 22, prot: 1.1 },
  { name: "Walnut (kernel)", cal: 26, prot: 0.6 },
];
const weightFoods = [
  { name: "Almonds", calPer100g: 579, protPer100g: 21 },
  { name: "Black beans", calPer100g: 132, protPer100g: 8.9 },
  { name: "Blueberry", calPer100g: 57, protPer100g: 0.7 },
  { name: "Brazil nuts", calPer100g: 656, protPer100g: 14.3 },
  { name: "Chickpeas", calPer100g: 164, protPer100g: 9 },
  { name: "Cooked oatmeal", calPer100g: 71, protPer100g: 2.5 },
  { name: "Cooked quinoa", calPer100g: 120, protPer100g: 4.4 },
  { name: "Cooked brown rice", calPer100g: 112, protPer100g: 2.6 },
  { name: "Cottage cheese", calPer100g: 98, protPer100g: 11 },
  { name: "Cod", calPer100g: 82, protPer100g: 18 },
  { name: "Granola", calPer100g: 489, protPer100g: 9.4 },
  { name: "Greek yogurt (plain)", calPer100g: 59, protPer100g: 10 },
  { name: "Ground turkey", calPer100g: 187, protPer100g: 29 },
  { name: "Lean beef steak", calPer100g: 271, protPer100g: 25 },
  { name: "Lentils", calPer100g: 116, protPer100g: 9 },
  { name: "Mozzarella", calPer100g: 280, protPer100g: 22 },
  { name: "Peanuts", calPer100g: 567, protPer100g: 25 },
  { name: "Pistachios", calPer100g: 562, protPer100g: 20 },
  { name: "Pumpkin seeds", calPer100g: 559, protPer100g: 30 },
  { name: "Salmon", calPer100g: 206, protPer100g: 22 },
  { name: "Strawberry", calPer100g: 32, protPer100g: 0.7 },
  { name: "Tempeh", calPer100g: 193, protPer100g: 20 },
  { name: "Tofu", calPer100g: 76, protPer100g: 8 },
  { name: "Turkey breast", calPer100g: 135, protPer100g: 30 },
  { name: "Walnuts", calPer100g: 654, protPer100g: 15 },
  { name: "Tuna (canned)", calPer100g: 132, protPer100g: 28 },
];
const volumeFoods = [
  { name: "Almond butter", calPerCup: 1625, protPerCup: 54 },
  { name: "Avocado oil", calPerCup: 1928, protPerCup: 0 },
  { name: "Canola oil", calPerCup: 1907, protPerCup: 0 },
  { name: "Cashew butter", calPerCup: 1575, protPerCup: 56 },
  { name: "Coconut oil", calPerCup: 1899, protPerCup: 0 },
  { name: "Guacamole", calPerCup: 345, protPerCup: 4 },
  { name: "Greek yogurt", calPerCup: 130, protPerCup: 23 },
  { name: "Hummus", calPerCup: 408, protPerCup: 13 },
  { name: "Olive oil", calPerCup: 1927, protPerCup: 0 },
  { name: "Peanut butter", calPerCup: 1504, protPerCup: 64 },
  { name: "Plain yogurt", calPerCup: 149, protPerCup: 8 },
  { name: "Sesame oil", calPerCup: 1859, protPerCup: 0 },
  { name: "Skim milk", calPerCup: 83, protPerCup: 8.3 },
  { name: "Soy milk", calPerCup: 100, protPerCup: 7 },
  { name: "Sunflower oil", calPerCup: 1900, protPerCup: 0 },
  { name: "Tahini", calPerCup: 1648, protPerCup: 54 },
  { name: "Whole milk", calPerCup: 149, protPerCup: 8 },
];
const volumeUnits = [
  { label: "Cups", factor: 1 },
  { label: "Tbsp", factor: 1 / 16 },
  { label: "Tsp", factor: 1 / 48 },
];
const DECIMAL_REGEX = /^\d*\.?\d*$/;

// alphabetize dropdowns
[countFoods, weightFoods, volumeFoods].forEach((arr) =>
  arr.sort((a, b) => a.name.localeCompare(b.name))
);

// ── “How It Works” Carousel ──────────────────────────────────────────────
function HowItWorks({ onFinish }) {
  const cards = [
    {
      title: "Track food",
      text: "Log calories and protein in a tap.",
    },
    {
      title: "Stay −500 kcal",
      text: "Maintain a safe daily calorie deficit.",
    },
    {
      title: "Lose ~1 lb / wk",
      text: "Consistency = steady progress.",
    },
    {
      title: "Healthy basics",
      text:
        "We track calories & protein. Still aim for enough fats and carbs for overall health—if you’re unsure, chat with a doctor or dietitian.",
    },
  ];

  const [idx, setIdx] = React.useState(0);

  const next = () => {
    if (idx < cards.length - 1) {
      setIdx(idx + 1);
    } else {
      localStorage.setItem("seenHowItWorks", "true");
      onFinish();
    }
  };

  return (
    <div
      style={{
        padding: 24,
        maxWidth: 400,
        margin: "auto",
        fontFamily: SYSTEM_FONT,
        textAlign: "center",
      }}
    >
      <h2>{cards[idx].title}</h2>
      <p>{cards[idx].text}</p>

      {/* bigger, friendlier button */}
      <button
        onClick={next}
        style={{
          marginTop: 28,
          padding: "14px 28px",
          fontSize: 18,
          borderRadius: 8,
          border: "none",
          background: "#0070f3",
          color: "#fff",
          fontFamily: SYSTEM_FONT,
          cursor: "pointer",
        }}
      >
        {idx < cards.length - 1 ? "Next ➜" : "Start tracking"}
      </button>
    </div>
  );
}

// ── FoodLogger ───────────────────────────────────────────────────────────
function FoodLogger({ foodLog, setFoodLog }) {
  const [measurementType, setMeasurementType] = useState("count");
  const [unit, setUnit] = useState("Cups");
  const [searchTerm, setSearchTerm] = useState("");
  const [value, setValue] = useState("");
  const [selectedFood, setSelectedFood] = useState(null);
  const [error, setError] = useState("");

  const options =
    measurementType === "count"
      ? countFoods
      : measurementType === "weight"
      ? weightFoods
      : volumeFoods;
  const filtered = options.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    if (!selectedFood || value === "") {
      return setError("Select a food and enter an amount.");
    }
    const amt = parseFloat(value);
    if (isNaN(amt) || amt <= 0) {
      return setError("Enter a valid number.");
    }
    setError("");
    let cal = 0,
      prot = 0,
      label = "";

    if (measurementType === "count") {
      cal = selectedFood.cal * amt;
      prot = selectedFood.prot * amt;
      label = `${value}× ${selectedFood.name}`;
    } else if (measurementType === "weight") {
      cal = (selectedFood.calPer100g * amt) / 100;
      prot = (selectedFood.protPer100g * amt) / 100;
      label = `${value} g ${selectedFood.name}`;
    } else {
      const factor = amt * volumeUnits.find((u) => u.label === unit).factor;
      cal = selectedFood.calPerCup * factor;
      prot = selectedFood.protPerCup * factor;
      label = `${value} ${unit} ${selectedFood.name}`;
    }

    setFoodLog((f) => [...f, { name: label, cal, prot }]);
    setSearchTerm("");
    setSelectedFood(null);
    setValue("");
  };

  return (
    <div>
      <h4 style={{ fontFamily: SYSTEM_FONT }}>
        Log Food{" "}
        <InfoButton message="Log what you eat by count, weight, or volume—consistency sustains your 500 kcal daily deficit." />
      </h4>

      {/* toggles */}
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        {[
          { key: "count", label: "Count" },
          { key: "weight", label: "Weight (g)" },
          { key: "volume", label: "Volume" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => {
              setMeasurementType(key);
              setUnit("Cups");
              setSearchTerm("");
              setValue("");
              setSelectedFood(null);
              setError("");
            }}
            style={{
              flex: 1,
              padding: 8,
              border: "1px solid #ccc",
              borderRadius: 4,
              background: measurementType === key ? "#0070f3" : "transparent",
              color: measurementType === key ? "#fff" : "#000",
              cursor: "pointer",
              fontFamily: SYSTEM_FONT,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* volume units */}
      {measurementType === "volume" && (
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
                cursor: "pointer",
                fontFamily: SYSTEM_FONT,
              }}
            >
              {u.label}
            </button>
          ))}
        </div>
      )}

      {/* search + amount + add */}
      <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
        <input
          list="food-options"
          placeholder="Search / select food…"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setError("");
            setSelectedFood(
              options.find((o) => o.name === e.target.value) || null
            );
          }}
          style={{ flex: 1, padding: 6, fontFamily: SYSTEM_FONT }}
        />
        <datalist id="food-options">
          {filtered.map((f, i) => (
            <option key={i} value={f.name} />
          ))}
        </datalist>

        <input
          type="text"
          inputMode="decimal"
          pattern="\d*\.?\d*"
          placeholder="Amount"
          value={value}
          onChange={(e) => {
            if (DECIMAL_REGEX.test(e.target.value)) {
              setValue(e.target.value);
              setError("");
            }
          }}
          style={{ width: 80, padding: 6, fontFamily: SYSTEM_FONT }}
        />

        <button
          onClick={handleAdd}
          style={{ padding: "6px 12px", fontFamily: SYSTEM_FONT }}
        >
          Add
        </button>
      </div>
      {error && (
        <p style={{ color: "red", marginTop: 0, fontFamily: SYSTEM_FONT }}>
          {error}
        </p>
      )}
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────
export default function App() {
  const [showCarousel, setShowCarousel] = useState(
    () => localStorage.getItem("seenHowItWorks") !== "true"
  );

  const today = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  })();

  // profile & logs
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

  // editing states
  const [foodEditingIndex, setFoodEditingIndex] = useState(null);
  const [tempFood, setTempFood] = useState({ name: "", cal: "", prot: "" });
  const [weightEditingIndex, setWeightEditingIndex] = useState(null);
  const [tempWeight, setTempWeight] = useState("");

  // custom entry
  const [customName, setCustomName] = useState("");
  const [customCal, setCustomCal] = useState("");
  const [customProt, setCustomProt] = useState("");
  const [customError, setCustomError] = useState("");

  // persist
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

  // handlers
  const finishOnboarding = () => {
    localStorage.setItem("onboardingComplete", "true");
    setEditingProfile(false);
  };
  const addCustomFood = () => {
    const cals = parseFloat(customCal);
    const pro = parseFloat(customProt) || 0;
    if (!customName || isNaN(cals)) {
      return setCustomError("Enter a name and valid calories.");
    }
    setCustomError("");
    setFoodLog((f) => [...f, { name: customName, cal: cals, prot: pro }]);
    setCustomName("");
    setCustomCal("");
    setCustomProt("");
  };
  const startEditFood = (i) => {
    setFoodEditingIndex(i);
    setTempFood({ ...foodLog[i] });
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
  };
  const cancelEditFood = () => setFoodEditingIndex(null);
  const removeFood = (i) => setFoodLog((f) => f.filter((_, idx) => idx !== i));

  const addWeightLog = () => {
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
      w.map((e, idx) =>
        idx === i ? { ...e, weight: parseFloat(tempWeight) } : e
      )
    );
    setWeightEditingIndex(null);
  };
  const cancelEditWeight = () => setWeightEditingIndex(null);
  const deleteWeight = (i) => setWeightLog((w) => w.filter((_, idx) => idx !== i));

  const resetDay = () => {
    setFoodLog([]);
    setSteps(0);
    localStorage.removeItem(`foodLog-${today}`);
    localStorage.removeItem(`steps-${today}`);
  };

  // first-run carousel
  if (showCarousel) {
    return <HowItWorks onFinish={() => setShowCarousel(false)} />;
  }

  // onboarding
  if (editingProfile) {
    return (
      <div style={{ padding: 24, fontFamily: SYSTEM_FONT }}>
        <h2>The 500 Plan</h2>
        <p>Track food. Hit your goals. Lose a pound a week.</p>
        <label>
          Sex:{" "}
          <select
            value={sex}
            onChange={(e) => setSex(e.target.value)}
            style={{ fontFamily: SYSTEM_FONT }}
          >
            <option>male</option>
            <option>female</option>
          </select>
        </label>
        <br />
        <label>
          Age:{" "}
          <input
            value={age}
            onChange={(e) => setAge(e.target.value)}
            style={{ fontFamily: SYSTEM_FONT }}
          />
        </label>
        <br />
        <label>
          Height (in):{" "}
          <input
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            style={{ fontFamily: SYSTEM_FONT }}
          />
        </label>
        <br />
        <label>
          Weight (lbs):{" "}
          <input
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            style={{ fontFamily: SYSTEM_FONT }}
          />
        </label>
        <br />
        <button onClick={finishOnboarding} style={{ fontFamily: SYSTEM_FONT }}>
          Save & Start
        </button>
      </div>
    );
  }

  // main UI
  const calsToday = foodLog.reduce((sum, f) => sum + f.cal, 0);
  const proteinToday = foodLog.reduce((sum, f) => sum + f.prot, 0);
  // round for display only:
  const proteinRounded = Math.round(proteinToday);
  const proteinGoal = Math.round(parseFloat(weight) * 0.8 || 0);
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

  return (
    <div
      style={{
        padding: 24,
        paddingBottom: 80,
        maxWidth: 500,
        margin: "auto",
        fontFamily: SYSTEM_FONT,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>The 500 Plan</h2>
        <button
          onClick={() => {
            localStorage.removeItem("onboardingComplete");
            setEditingProfile(true);
          }}
          style={{ fontFamily: SYSTEM_FONT }}
        >
          ⚙️
        </button>
      </div>

      {/* Home */}
      {screen === "home" && (
        <>
          <h3 style={{ fontFamily: SYSTEM_FONT }}>
            Calories{" "}
            <InfoButton message="Your body burns calories even at rest (BMR). Eating ~500 kcal less than that each day sheds about 1 lb a week." />
          </h3>
          <CalorieBar consumed={calsToday} goal={calorieGoal} />

          <h3 style={{ fontFamily: SYSTEM_FONT }}>
            Protein{" "}
            <InfoButton message="Hit your daily protein to keep muscle and stay full while cutting calories." />
          </h3>
          <ProgressBar
            value={proteinRounded}
            goal={proteinGoal}
            color="#4caf50"
            label={`${proteinRounded} / ${proteinGoal} g`}
          />

          <h3 style={{ fontFamily: SYSTEM_FONT }}>
            Steps{" "}
            <InfoButton message="More steps = more burn. ~10 k steps add roughly 300-500 kcal to your daily budget." />
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
            style={{ width: 80, fontFamily: SYSTEM_FONT }}
          />
          <p style={{ fontFamily: SYSTEM_FONT }}>
            +{caloriesFromSteps} cal from steps
          </p>
          <button
            onClick={() => {
              if (window.confirm("Are you sure? This cannot be undone.")) {
                resetDay();
              }
            }}
            style={{
              marginTop: 10,
              background: "#000",
              color: "#fff",
              padding: 10,
              borderRadius: 5,
              fontFamily: SYSTEM_FONT,
            }}
          >
            🔄 Reset Day
          </button>
        </>
      )}

      {/* Food */}
      {screen === "food" && (
        <>
          <FoodLogger foodLog={foodLog} setFoodLog={setFoodLog} />

          <h4 style={{ fontFamily: SYSTEM_FONT }}>Custom Entry</h4>
          <input
            placeholder="Name"
            value={customName}
            onChange={(e) => {
              setCustomName(e.target.value);
              setCustomError("");
            }}
            style={{ marginRight: 8, fontFamily: SYSTEM_FONT }}
          />
          <input
            placeholder="Calories"
            type="text"
            inputMode="decimal"
            pattern="\d*\.?\d*"
            value={customCal}
            onChange={(e) => {
              if (DECIMAL_REGEX.test(e.target.value)) {
                setCustomCal(e.target.value);
                setCustomError("");
              }
            }}
            style={{ marginRight: 8, fontFamily: SYSTEM_FONT }}
          />
          <input
            placeholder="Protein"
            type="text"
            inputMode="decimal"
            pattern="\d*\.?\d*"
            value={customProt}
            onChange={(e) => {
              if (DECIMAL_REGEX.test(e.target.value)) {
                setCustomProt(e.target.value);
                setCustomError("");
              }
            }}
            style={{ marginRight: 8, fontFamily: SYSTEM_FONT }}
          />
          <button onClick={addCustomFood} style={{ fontFamily: SYSTEM_FONT }}>
            Add
          </button>
          {customError && (
            <p style={{ color: "red", marginTop: 4, fontFamily: SYSTEM_FONT }}>
              {customError}
            </p>
          )}

          <h4 style={{ fontFamily: SYSTEM_FONT }}>Logged Foods</h4>
          <ul>
            {foodLog.map((it, i) => (
              <li
                key={i}
                style={{ marginBottom: 6, fontFamily: SYSTEM_FONT }}
              >
                {foodEditingIndex === i ? (
                  <>
                    <input
                      value={tempFood.name}
                      onChange={(e) =>
                        setTempFood((t) => ({ ...t, name: e.target.value }))
                      }
                      style={{ marginRight: 4, fontFamily: SYSTEM_FONT }}
                    />
                    <input
                      value={tempFood.cal}
                      type="number"
                      onChange={(e) =>
                        setTempFood((t) => ({ ...t, cal: e.target.value }))
                      }
                      style={{
                        width: 60,
                        marginRight: 4,
                        fontFamily: SYSTEM_FONT,
                      }}
                    />
                    <input
                      value={tempFood.prot}
                      type="number"
                      onChange={(e) =>
                        setTempFood((t) => ({ ...t, prot: e.target.value }))
                      }
                      style={{
                        width: 60,
                        marginRight: 4,
                        fontFamily: SYSTEM_FONT,
                      }}
                    />
                    <button
                      onClick={() => saveEditFood(i)}
                      style={{ fontFamily: SYSTEM_FONT }}
                    >
                      Save
                    </button>{" "}
                    <button
                      onClick={cancelEditFood}
                      style={{ fontFamily: SYSTEM_FONT }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    {it.name} — {it.cal.toFixed(1)} kcal /{" "}
                    {it.prot.toFixed(1)}g protein{" "}
                    <button
                      onClick={() => startEditFood(i)}
                      style={{ fontFamily: SYSTEM_FONT }}
                    >
                      ✏️
                    </button>{" "}
                    <button
                      onClick={() => removeFood(i)}
                      style={{ fontFamily: SYSTEM_FONT }}
                    >
                      ✖️
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Weight */}
      {screen === "weight" && (
        <>
          <h3 style={{ fontFamily: SYSTEM_FONT }}>Track Weight</h3>
          {weightEditingIndex !== null ? (
            <>
              <input
                value={tempWeight}
                onChange={(e) => setTempWeight(e.target.value)}
                style={{ marginRight: 8, fontFamily: SYSTEM_FONT }}
              />
              <button
                onClick={() => saveEditWeight(weightEditingIndex)}
                style={{ fontFamily: SYSTEM_FONT }}
              >
                Save
              </button>{" "}
              <button
                onClick={cancelEditWeight}
                style={{ fontFamily: SYSTEM_FONT }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <input
                placeholder="Today's weight"
                value={tempWeight}
                onChange={(e) => setTempWeight(e.target.value)}
                style={{ marginRight: 8, fontFamily: SYSTEM_FONT }}
              />
              <button
                onClick={addWeightLog}
                style={{ fontFamily: SYSTEM_FONT }}
              >
                Log
              </button>
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
              <li
                key={i}
                style={{ marginBottom: 6, fontFamily: SYSTEM_FONT }}
              >
                {weightEditingIndex === i ? null : (
                  <>
                    {w.date}: {w.weight} lb{" "}
                    <button
                      onClick={() => startEditWeight(i)}
                      style={{ fontFamily: SYSTEM_FONT }}
                    >
                      ✏️
                    </button>{" "}
                    <button
                      onClick={() => deleteWeight(i)}
                      style={{ fontFamily: SYSTEM_FONT }}
                    >
                      ✖️
                    </button>
                  </>
                )}
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
          fontFamily: SYSTEM_FONT,
        }}
      >
        <button style={navBtnStyle(screen === "home")} onClick={() => setScreen("home")}>
          🏠 Home
        </button>
        <button style={navBtnStyle(screen === "food")} onClick={() => setScreen("food")}>
          🍽️ Food
        </button>
        <button style={navBtnStyle(screen === "weight")} onClick={() => setScreen("weight")}>
          ⚖️ Weight
        </button>
      </div>
    </div>
  );
}

