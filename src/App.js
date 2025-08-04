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

// ── System font stack ────────────────────────────────────────────────
const SYSTEM_FONT =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';

// ── Info tiny “ⓘ” helper ────────────────────────────────────────────
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

// ── Simple horizontal progress bar ──────────────────────────────────
const ProgressBar = ({ value, goal, color, label }) => (
  <>
    <div
      style={{
        height: 20,
        background: "#e0e0e0",
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

// ── Bottom-nav button styling helper ────────────────────────────────
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

// ── Regex used throughout for number-only inputs ────────────────────
const DECIMAL_REGEX = /^\d*\.?\d*$/;

// ── Calories burned per step (rough average) ────────────────────────
const CALS_PER_STEP = 0.04;

/* ===================================================================
   ⬇️  APP COMPONENT
   ===================================================================*/
export default function App() {
  // ——— On-device state & persistence ————————————————
  const [height, setHeight] = useState(
    () => localStorage.getItem("height") || ""
  );
  const [weight, setWeight] = useState(
    () => localStorage.getItem("weight") || ""
  );
  const [age, setAge] = useState(() => localStorage.getItem("age") || "");
  const [sex, setSex] = useState(() => localStorage.getItem("sex") || "male");

  const today = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  })();

  const [foodLog, setFoodLog] = useState(() => {
    const saved = localStorage.getItem(`food-${today}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [steps, setSteps] = useState(
    () => parseInt(localStorage.getItem(`steps-${today}`), 10) || 0
  );
  const [weightLog, setWeightLog] = useState(() => {
    const saved = localStorage.getItem("weightLog");
    return saved ? JSON.parse(saved) : [];
  });

  // screens: home | food | weight
  const [screen, setScreen] = useState("home");

  // ✏️  edit helpers used in Food & Weight pages (unchanged) ----------
  const [customName, setCustomName] = useState("");
  const [customCal, setCustomCal] = useState("");
  const [customProt, setCustomProt] = useState("");
  const [customError, setCustomError] = useState("");

  const [tempFood, setTempFood] = useState({ name: "", cal: "", prot: "" });
  const [foodEditingIndex, setFoodEditingIndex] = useState(null);

  const [tempWeight, setTempWeight] = useState("");
  const [weightEditingIndex, setWeightEditingIndex] = useState(null);

  // ——— Persist to localStorage whenever things change ————————
  useEffect(() => {
    localStorage.setItem("height", height);
  }, [height]);
  useEffect(() => {
    localStorage.setItem("weight", weight);
  }, [weight]);
  useEffect(() => {
    localStorage.setItem("age", age);
  }, [age]);
  useEffect(() => {
    localStorage.setItem("sex", sex);
  }, [sex]);
  useEffect(() => {
    localStorage.setItem(`food-${today}`, JSON.stringify(foodLog));
  }, [foodLog, today]);
  useEffect(() => {
    localStorage.setItem(`steps-${today}`, steps.toString());
  }, [steps, today]);
  useEffect(() => {
    localStorage.setItem("weightLog", JSON.stringify(weightLog));
  }, [weightLog]);

  // ——— Derived daily metrics ————————————————————————————————
  const calsToday = foodLog.reduce((sum, f) => sum + f.cal, 0);
  const proteinToday = foodLog.reduce((sum, f) => sum + f.prot, 0);
  const proteinRounded = Math.round(proteinToday);
  const proteinGoal = Math.round(parseFloat(weight) * 0.8 || 0);

  const caloriesFromSteps = Math.round(steps * CALS_PER_STEP);

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

  /* ──────────────────────────────────────────────────────────
     Home-screen layout (no persistent header)
     ──────────────────────────────────────────────────────────*/
  return (
    <div
      style={{
        padding: 24,
        paddingBottom: 80, // room for bottom-nav
        maxWidth: 500,
        margin: "auto",
        fontFamily: SYSTEM_FONT,
      }}
    >
      {/* HOME */}
      {screen === "home" && (
        <>
          {/* Calories */}
          <h3 style={{ fontFamily: SYSTEM_FONT }}>
            Calories
            <InfoButton message="Stay within your daily budget (BMR – 500 kcal). Steps add extra allowance automatically." />
          </h3>
          <ProgressBar
            value={calsToday}
            goal={calorieGoal}
            color="#4caf50"
            label={`${calsToday.toLocaleString()} / ${calorieGoal.toLocaleString()} kcal`}
          />

          {/* Protein */}
          <h3 style={{ fontFamily: SYSTEM_FONT }}>
            Protein
            <InfoButton message="Aim for ≈ 0.8 g per lb of body-weight to preserve muscle and curb hunger." />
          </h3>
          <ProgressBar
            value={proteinRounded}
            goal={proteinGoal}
            color="#2196f3"
            label={`${proteinRounded} / ${proteinGoal} g`}
          />

          {/* Steps */}
          <h3 style={{ fontFamily: SYSTEM_FONT }}>
            Steps
            <InfoButton message="Every step burns a little energy and raises your calorie target." />
          </h3>
          <ProgressBar
            value={steps}
            goal={10000}
            color="#9c27b0"
            label={`${steps.toLocaleString()} / 10,000`}
          />
        </>
      )}

      {/* FOOD LOGGER (unchanged) */}
      {screen === "food" && (
        <>
          <FoodLogger
            foodLog={foodLog}
            setFoodLog={setFoodLog}
            customName={customName}
            setCustomName={setCustomName}
            customCal={customCal}
            setCustomCal={setCustomCal}
            customProt={customProt}
            setCustomProt={setCustomProt}
            customError={customError}
            setCustomError={setCustomError}
            tempFood={tempFood}
            setTempFood={setTempFood}
            foodEditingIndex={foodEditingIndex}
            setFoodEditingIndex={setFoodEditingIndex}
          />
        </>
      )}

      {/* WEIGHT / PROGRESS (unchanged) */}
      {screen === "weight" && (
        <WeightSection
          weightLog={weightLog}
          setWeightLog={setWeightLog}
          tempWeight={tempWeight}
          setTempWeight={setTempWeight}
          weightEditingIndex={weightEditingIndex}
          setWeightEditingIndex={setWeightEditingIndex}
        />
      )}

      {/* ── Bottom Navigation ─────────────────────────────── */}
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
          fontFamily: SYSTEM_FONT,
        }}
      >
        <button style={navBtnStyle(screen === "home")} onClick={() => setScreen("home")}>
          🏠 Home
        </button>
        <button style={navBtnStyle(screen === "food")} onClick={() => setScreen("food")}>
          📋 Log
        </button>
        <button style={navBtnStyle(screen === "weight")} onClick={() => setScreen("weight")}>
          📈 Progress
        </button>
      </div>
    </div>
  );
}

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
      text: "We focus on calories & protein—the key drivers of weight-loss and satiety. Healthy fats & carbs matter too, but most people meet those needs by eating normally. If you’re unsure, a quick chat with your doctor or a dietitian can help.",
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
