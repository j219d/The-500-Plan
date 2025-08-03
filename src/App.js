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

// ── Standard Progress bar (for protein & steps) ──────────────────────────
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

// ── CalorieBar: inverted remaining-calories bar ──────────────────────────
const CalorieBar = ({ consumed, goal }) => {
  const remaining = goal - consumed;
  const pct = Math.max((remaining / goal) * 100, 0);
  const overflowPct = remaining < 0
    ? Math.min((-remaining / goal) * 100, 100)
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
        {/* Remaining portion */}
        <div
          style={{
            width: `${pct}%`,
            background: "#2196f3",
            height: "100%",
            transition: "width 0.3s ease",
          }}
        />
        {/* Red overflow if over goal */}
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
      <p>
        {remaining >= 0
          ? `${remaining.toFixed(0)} kcal remaining`
          : `Over by ${(-remaining).toFixed(0)} kcal!`}
      </p>
    </>
  );
};

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
  // Count-only items
  { name: "Egg", cal: 70, prot: 6 },
  { name: "Apple", cal: 95, prot: 1 },
  { name: "Banana", cal: 105, prot: 1.3 },
  { name: "Orange", cal: 62, prot: 1.2 },
  { name: "Pear", cal: 101, prot: 0.6 },
  { name: "Peach", cal: 59, prot: 1.4 },
  { name: "Plum", cal: 30, prot: 0.5 },
  { name: "Kiwi", cal: 42, prot: 0.8 },
  { name: "Avocado", cal: 240, prot: 3 },
  { name: "Carrot (medium)", cal: 25, prot: 0.6 },
  { name: "Cucumber (medium)", cal: 24, prot: 1 },
  { name: "Bell pepper", cal: 24, prot: 1 },
  { name: "Tomato", cal: 22, prot: 1.1 },
  { name: "Eggplant slice", cal: 5, prot: 0.2 },
  { name: "Mushroom (button)", cal: 3, prot: 0.4 },
  { name: "Celery stalk", cal: 6, prot: 0.3 },
  { name: "Bread slice (whole wheat)", cal: 70, prot: 3.6 },
  // Berries & small fruits
  { name: "Strawberry", cal: 4, prot: 0.1 },
  { name: "Blueberry", cal: 1, prot: 0 },
  { name: "Raspberry", cal: 1, prot: 0.1 },
  { name: "Blackberry", cal: 2, prot: 0.1 },
  { name: "Cherry", cal: 4, prot: 0.1 },
  { name: "Grape", cal: 3, prot: 0.1 },
  // Melons, exotic, dried
  { name: "Watermelon wedge", cal: 85, prot: 1.7 },
  { name: "Cantaloupe wedge", cal: 53, prot: 1.3 },
  { name: "Honeydew wedge", cal: 61, prot: 0.9 },
  { name: "Pineapple chunk", cal: 82, prot: 0.9 },
  { name: "Mango slice", cal: 35, prot: 0.7 },
  { name: "Papaya slice", cal: 68, prot: 0.5 },
  { name: "Lychee", cal: 6, prot: 0.1 },
  { name: "Fig (fresh)", cal: 47, prot: 0.5 },
  { name: "Apricot", cal: 17, prot: 0.5 },
  { name: "Nectarine", cal: 62, prot: 1.5 },
  { name: "Pluot", cal: 34, prot: 0.8 },
  { name: "Date (Medjool)", cal: 66, prot: 0.4 },
  { name: "Prune", cal: 20, prot: 0.2 },
  { name: "Raisin (small handful)", cal: 85, prot: 1 },
  { name: "Grapefruit segment", cal: 8, prot: 0.2 },
  { name: "Dragonfruit slice", cal: 60, prot: 1 },
  { name: "Starfruit slice", cal: 6, prot: 0.2 },
  { name: "Passionfruit", cal: 17, prot: 0.4 },
  { name: "Kiwi slice", cal: 6, prot: 0.1 },
  { name: "Cherry tomato", cal: 3, prot: 0.2 },
  { name: "Snap pea pod", cal: 4, prot: 0.4 },
  { name: "Edamame pod", cal: 9, prot: 0.8 },
  { name: "Radish", cal: 1, prot: 0.1 },
  { name: "Brussels sprout", cal: 8, prot: 0.6 },
  { name: "Broccoli floret", cal: 6, prot: 0.5 },
  { name: "Cauliflower floret", cal: 5, prot: 0.4 },
  { name: "Snap pea", cal: 4, prot: 0.4 },
  { name: "Pickle spear", cal: 4, prot: 0.2 },
  { name: "Olive (green)", cal: 5, prot: 0.1 },
  { name: "Olive (black)", cal: 4, prot: 0.1 },
];

const weightFoods = [
  // Weight-only (per 100 g)
  { name: "Chicken breast", calPer100g: 165, protPer100g: 31 },
  { name: "Turkey breast", calPer100g: 135, protPer100g: 30 },
  { name: "Lean beef steak", calPer100g: 271, protPer100g: 25 },
  { name: "Ground turkey", calPer100g: 187, protPer100g: 29 },
  { name: "Salmon", calPer100g: 206, protPer100g: 22 },
  { name: "Tuna (canned)", calPer100g: 132, protPer100g: 28 },
  { name: "Cod", calPer100g: 82, protPer100g: 18 },
  { name: "Tilapia", calPer100g: 129, protPer100g: 26 },
  { name: "Trout", calPer100g: 168, protPer100g: 20 },
  { name: "Mackerel", calPer100g: 205, protPer100g: 19 },
  { name: "Anchovies", calPer100g: 210, protPer100g: 29 },
  { name: "Tofu", calPer100g: 76, protPer100g: 8 },
  { name: "Tempeh", calPer100g: 193, protPer100g: 20 },
  { name: "Cottage cheese", calPer100g: 98, protPer100g: 11 },
  { name: "Greek yogurt (plain)", calPer100g: 59, protPer100g: 10 },
  { name: "Mozzarella", calPer100g: 280, protPer100g: 22 },
  { name: "Cheddar cheese", calPer100g: 402, protPer100g: 25 },
  { name: "Almonds", calPer100g: 579, protPer100g: 21 },
  { name: "Walnuts", calPer100g: 654, protPer100g: 15 },
  { name: "Peanuts", calPer100g: 567, protPer100g: 25 },
  { name: "Cashews", calPer100g: 553, protPer100g: 18 },
  { name: "Pistachios", calPer100g: 562, protPer100g: 20 },
  { name: "Sunflower seeds", calPer100g: 584, protPer100g: 21 },
  { name: "Pumpkin seeds", calPer100g: 559, protPer100g: 30 },
  { name: "Chickpeas", calPer100g: 164, protPer100g: 9 },
  { name: "Lentils", calPer100g: 116, protPer100g: 9 },
  { name: "Black beans", calPer100g: 132, protPer100g: 8.9 },
  { name: "Kidney beans", calPer100g: 333, protPer100g: 23 },
  { name: "Navy beans", calPer100g: 337, protPer100g: 22 },
  { name: "Pinto beans", calPer100g: 347, protPer100g: 21 },
  { name: "Cooked brown rice", calPer100g: 112, protPer100g: 2.6 }, // dual-mode
  { name: "Cooked quinoa", calPer100g: 120, protPer100g: 4.4 },      // dual-mode
  { name: "Cooked oatmeal", calPer100g: 71, protPer100g: 2.5 },      // dual-mode
  { name: "Granola", calPer100g: 489, protPer100g: 9.4 },            // dual-mode
  { name: "Strawberry", calPer100g: 32, protPer100g: 0.7 },          // all three
  { name: "Blueberry", calPer100g: 57, protPer100g: 0.7 },           // weight & volume
  { name: "Raspberry", calPer100g: 52, protPer100g: 1.2 },           // weight & volume
  { name: "Blackberry", calPer100g: 43, protPer100g: 1.4 },          // weight & volume
];

const volumeFoods = [
  // Volume-only (per cup)
  { name: "Olive oil",       calPerCup: 1927, protPerCup: 0 },
  { name: "Canola oil",      calPerCup: 1907, protPerCup: 0 },
  { name: "Coconut oil",     calPerCup: 1899, protPerCup: 0 },
  { name: "Avocado oil",     calPerCup: 1928, protPerCup: 0 },
  { name: "Sesame oil",      calPerCup: 1859, protPerCup: 0 },
  { name: "Sunflower oil",   calPerCup: 1900, protPerCup: 0 },
  { name: "Peanut butter",   calPerCup: 1504, protPerCup: 64 },
  { name: "Almond butter",   calPerCup: 1625, protPerCup: 54 },
  { name: "Cashew butter",   calPerCup: 1575, protPerCup: 56 },
  { name: "Tahini",          calPerCup: 1648, protPerCup: 54 },
  { name: "Hummus",          calPerCup: 408,  protPerCup: 13 },
  { name: "Guacamole",       calPerCup: 345,  protPerCup: 4 },
  { name: "Greek yogurt",    calPerCup: 130,  protPerCup: 23 },
  { name: "Plain yogurt",    calPerCup: 149,  protPerCup: 8 },
  { name: "Cottage cheese",  calPerCup: 206,  protPerCup: 24 },
  { name: "Whole milk",      calPerCup: 149,  protPerCup: 8 },
  { name: "2% milk",         calPerCup: 122,  protPerCup: 8 },
  { name: "Skim milk",       calPerCup: 83,   protPerCup: 8.3 },
  { name: "Soy milk",        calPerCup: 100,  protPerCup: 7 },
  { name: "Almond milk",     calPerCup: 91,   protPerCup: 3.6 },
  { name: "Oat milk",        calPerCup: 120,  protPerCup: 3 },
  { name: "Rice milk",       calPerCup: 120,  protPerCup: 1 },
  { name: "Coconut milk",    calPerCup: 552,  protPerCup: 5 },
  { name: "Orange juice",    calPerCup: 112,  protPerCup: 2 },
  { name: "Apple juice",     calPerCup: 114,  protPerCup: 0.2 },
  { name: "Grape juice",     calPerCup: 152,  protPerCup: 0 },
  { name: "Cranberry juice", calPerCup: 115,  protPerCup: 0 },
  { name: "Tomato juice",    calPerCup: 41,   protPerCup: 2 },
  { name: "Vegetable broth", calPerCup: 12,   protPerCup: 1 },
  { name: "Chicken broth",   calPerCup: 38,   protPerCup: 5 },
  { name: "Vegetable soup",  calPerCup: 92,   protPerCup: 3 },
  { name: "Tomato soup",     calPerCup: 74,   protPerCup: 2 },
  { name: "Lentil soup",     calPerCup: 223,  protPerCup: 17 },
  { name: "Minestrone soup", calPerCup: 90,   protPerCup: 4 },
  { name: "Beet soup",       calPerCup: 70,   protPerCup: 2 },
  { name: "Smoothie",        calPerCup: 215,  protPerCup: 5 },
  { name: "Protein shake",   calPerCup: 200,  protPerCup: 20 },
  { name: "Cooked oatmeal",  calPerCup: 154,  protPerCup: 6 },  // dual-mode
  { name: "Cooked rice",     calPerCup: 205,  protPerCup: 4.2 },// dual-mode
  { name: "Cooked quinoa",   calPerCup: 222,  protPerCup: 8 },  // dual-mode
  { name: "Cooked black beans", calPerCup: 227, protPerCup: 15 },//dual-mode
  { name: "Cooked lentils",  calPerCup: 230,  protPerCup: 18 }, //dual-mode
  { name: "Granola",         calPerCup: 597,  protPerCup: 11.5 },//dual-mode
  { name: "Strawberry",      calPerCup: 49,   protPerCup: 1 },  // all three
];
const volumeUnits = [
  { label: "Cups", factor: 1 },
  { label: "Tbsp", factor: 1 / 16 },
  { label: "Tsp", factor: 1 / 48 },
];

// regex to allow only digits and at most one decimal point
const DECIMAL_REGEX = /^\d*\.?\d*$/;

// ── Unified FoodLogger ───────────────────────────────────────────────────
function FoodLogger({ foodLog, setFoodLog }) {
  const [measurementType, setMeasurementType] = useState("count");
  const [unit, setUnit] = useState("Cups");
  const [searchTerm, setSearchTerm] = useState("");
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

  const handleSearchChange = (e) => {
    const v = e.target.value;
    setSearchTerm(v);
    setSelectedFood(options.find((o) => o.name === v) || null);
  };

  const handleAdd = () => {
    if (!selectedFood || value === "") return;
    const amt = parseFloat(value);
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
      const unitObj = volumeUnits.find((u) => u.label === unit);
      const factor = amt * unitObj.factor;
      cal = selectedFood.calPerCup * factor;
      prot = selectedFood.protPerCup * factor;
      label = `${value} ${unit} ${selectedFood.name}`;
    }

    setFoodLog((f) => [
      ...f,
      {
        name: label,
        cal,
        prot,
      },
    ]);
    setSearchTerm("");
    setSelectedFood(null);
    setValue("");
  };

  return (
    <div>
      <h4>
        Log Food
        <InfoButton
          message="Quickly log everything you eat — choose count, weight, or volume, search or select a food, enter the amount, and hit Add. Consistent logging helps you stay on track with your daily calorie and protein goals."
        />
      </h4>

      {/* Line 1: Count / Weight / Volume toggles */}
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
              setSelectedFood(null);
              setValue("");
            }}
            style={{
              flex: 1,
              padding: 8,
              border: "1px solid #ccc",
              borderRadius: 4,
              background: measurementType === key ? "#0070f3" : "transparent",
              color: measurementType === key ? "#fff" : "#000",
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Line 2: Volume unit toggles if needed */}
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
              }}
            >
              {u.label}
            </button>
          ))}
        </div>
      )}

      {/* Line 3: search + amount + add */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          list="food-options"
          placeholder="Search / select food…"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ flex: 1, padding: 6 }}
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
            const raw = e.target.value;
            if (DECIMAL_REGEX.test(raw)) setValue(raw);
          }}
          style={{ width: 80, padding: 6 }}
        />

        <button onClick={handleAdd} style={{ padding: "6px 12px" }}>
          Add
        </button>
      </div>
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

  // Edit state
  const [foodEditingIndex, setFoodEditingIndex] = useState(null);
  const [tempFood, setTempFood] = useState({ name: "", cal: "", prot: "" });
  const [weightEditingIndex, setWeightEditingIndex] = useState(null);
  const [tempWeight, setTempWeight] = useState("");

  // Custom entry
  const [customName, setCustomName] = useState("");
  const [customCal, setCustomCal] = useState("");
  const [customProt, setCustomProt] = useState("");

  // Calculations
  const calsToday = foodLog.reduce((sum, f) => sum + f.cal, 0);
  const proteinToday = foodLog.reduce((sum, f) => sum + f.prot, 0);
  // round protein to 2 decimal places
  const proteinRounded = Math.round(proteinToday * 100) / 100;
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
  const removeFood = (i) =>
    setFoodLog((f) => f.filter((_, idx) => idx !== i));

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
  const deleteWeight = (i) =>
    setWeightLog((w) => w.filter((_, idx) => idx !== i));

  const resetDay = () => {
    setFoodLog([]);
    setSteps(0);
    localStorage.removeItem(`foodLog-${today}`);
    localStorage.removeItem(`steps-${today}`);
  };

  // Onboarding screen
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
        <label>
          Age: <input value={age} onChange={(e) => setAge(e.target.value)} />
        </label>
        <br />
        <label>
          Height (in):{" "}
          <input value={height} onChange={(e) => setHeight(e.target.value)} />
        </label>
        <br />
        <label>
          Weight (lbs):{" "}
          <input value={weight} onChange={(e) => setWeight(e.target.value)} />
        </label>
        <br />
        <button onClick={finishOnboarding}>Save & Start</button>
      </div>
    );
  }

  // Main UI
  return (
    <div
      style={{
        padding: 24,
        paddingBottom: 80,
        maxWidth: 500,
        margin: "auto",
        fontFamily: "sans-serif",
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
        >
          ⚙️
        </button>
      </div>

      {/* Home */}
      {screen === "home" && (
        <>
          <h3>
            Calories
            <InfoButton message="Your BMR is what you’d burn at rest. We subtract 500 kcal for a safe deficit." />
          </h3>
          <CalorieBar consumed={calsToday} goal={calorieGoal} />

          <h3>
            Protein
            <InfoButton message="Protein preserves muscle during a deficit and keeps you full." />
          </h3>
          <ProgressBar
            value={proteinRounded}
            goal={proteinGoal}
            color="#4caf50"
            label={`${proteinRounded.toFixed(2)} / ${proteinGoal} g`}
          />

          <h3>
            Steps
            <InfoButton message="Every 10,000 steps yields ~300–500 extra kcal burn." />
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

          <h4>Custom Entry</h4>
          <input
            placeholder="Name"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
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
              }
            }}
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
              }
            }}
          />
          <button onClick={addCustomFood}>Add</button>

          <h4>Logged Foods</h4>
          <ul>
            {foodLog.map((it, i) => (
              <li key={i} style={{ marginBottom: 6 }}>
                {foodEditingIndex === i ? (
                  <>
                    <input
                      value={tempFood.name}
                      onChange={(e) =>
                        setTempFood((t) => ({ ...t, name: e.target.value }))
                      }
                    />
                    <input
                      value={tempFood.cal}
                      type="number"
                      onChange={(e) =>
                        setTempFood((t) => ({ ...t, cal: e.target.value }))
                      }
                    />
                    <input
                      value={tempFood.prot}
                      type="number"
                      onChange={(e) =>
                        setTempFood((t) => ({ ...t, prot: e.target.value }))
                      }
                    />
                    <button onClick={() => saveEditFood(i)}>Save</button>
                    <button onClick={cancelEditFood}>Cancel</button>
                  </>
                ) : (
                  <>
                    {it.name} — {it.cal.toFixed(1)} kcal /{" "}
                    {it.prot.toFixed(1)}g protein{" "}
                    <button onClick={() => startEditFood(i)}>✏️</button>{" "}
                    <button onClick={() => removeFood(i)}>✖️</button>
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
              <button onClick={cancelEditWeight}>Cancel</button>
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
                {weightEditingIndex === i ? null : (
                  <>
                    {w.date}: {w.weight} lb{" "}
                    <button onClick={() => startEditWeight(i)}>✏️</button>{" "}
                    <button onClick={() => deleteWeight(i)}>✖️</button>
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
      </div>
    </div>
  );
}
