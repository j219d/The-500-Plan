
// The 500 Plan – Full MVP App (v1.1 with styled progress bars: Blue = Calories, Green = Protein)
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

function App() {
  const today = new Date().toISOString().split("T")[0];

  const [screen, setScreen] = useState("home");
  const [editing, setEditing] = useState(true);

  const [sex, setSex] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const [steps, setSteps] = useState(0);
  const [foodLog, setFoodLog] = useState([]);
  const [weightLog, setWeightLog] = useState([]);
  const [search, setSearch] = useState("");
  const [foodList, setFoodList] = useState([]);
  const [customName, setCustomName] = useState("");
  const [customCal, setCustomCal] = useState("");
  const [customProt, setCustomProt] = useState("");
  const [newWeight, setNewWeight] = useState("");

  const calsToday = foodLog.reduce((sum, f) => sum + f.cal, 0);
  const proteinToday = foodLog.reduce((sum, f) => sum + f.prot, 0);
  const caloriesFromSteps = Math.round(steps * 0.04);

  const bmr = () => {
    const h = parseInt(height), w = parseFloat(weight), a = parseInt(age);
    if (!h || !w || !a) return 1600;
    const heightCm = h * 2.54, weightKg = w * 0.453592;
    return Math.round(
      sex === "male"
        ? 10 * weightKg + 6.25 * heightCm - 5 * a + 5
        : 10 * weightKg + 6.25 * heightCm - 5 * a - 161
    );
  };

  const calorieGoal = bmr() - 500 + caloriesFromSteps;
  const proteinGoal = Math.round(parseFloat(weight) * 0.8);

  useEffect(() => {
    const s = localStorage.getItem("sex");
    const a = localStorage.getItem("age");
    const h = localStorage.getItem("height");
    const w = localStorage.getItem("weight");
    if (s && a && h && w) {
      setSex(s); setAge(a); setHeight(h); setWeight(w);
      setEditing(false);
    }
    const food = localStorage.getItem(`foodLog-${today}`);
    const step = localStorage.getItem(`steps-${today}`);
    const weights = localStorage.getItem("weightLog");
    if (food) setFoodLog(JSON.parse(food));
    if (step) setSteps(parseInt(step));
    if (weights) setWeightLog(JSON.parse(weights));
  }, []);

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
    const results = presetFoods.filter(f => {
      const name = f.split(" - ")[0].toLowerCase();
      return name.startsWith(search.toLowerCase()) || name.includes(" " + search.toLowerCase());
    });
    setFoodList(search.length > 0 ? results : []);
  }, [search]);

  const handlePresetSelect = (food) => {
    const [namePart, values] = food.split(" - ");
    const [kcal, prot] = values.replace(/kcal|protein/g, "").split("/");
    const cals = parseFloat(kcal.trim());
    const pro = parseFloat(prot.trim());
    setFoodLog([...foodLog, { name: namePart, cal: cals, prot: pro }]);
    setSearch("");
    setFoodList([]);
  };

  const addCustomFood = () => {
    const cals = parseFloat(customCal);
    const pro = parseFloat(customProt);
    if (!isNaN(cals) && !isNaN(pro) && customName) {
      setFoodLog([...foodLog, { name: customName, cal: cals, prot: pro }]);
      setCustomName(""); setCustomCal(""); setCustomProt("");
    }
  };

  const removeFood = (indexToRemove) => {
    const updated = foodLog.filter((_, idx) => idx !== indexToRemove);
    setFoodLog(updated);
  };

  const addWeight = () => {
    const w = parseFloat(newWeight);
    if (!isNaN(w)) {
      const entry = { date: today, weight: w };
      const updated = [...weightLog, entry];
      setWeightLog(updated);
      localStorage.setItem("weightLog", JSON.stringify(updated));
      setNewWeight("");
    }
  };

  const graphData = {
    labels: weightLog.map(w => w.date),
    datasets: [{
      label: "Weight (lbs)",
      data: weightLog.map(w => w.weight),
      fill: false,
      borderColor: "blue",
      tension: 0.1,
    }],
  };

  if (editing) {
    return (
      <div style={{ padding: 24 }}>
        <h2>The 500 Plan</h2>
        <p>Track food. Hit your goals. Lose a pound a week.</p>
        <label>Sex: <select value={sex} onChange={e => setSex(e.target.value)}><option>male</option><option>female</option></select></label><br />
        <label>Age: <input value={age} onChange={e => setAge(e.target.value)} /></label><br />
        <label>Height (inches): <input value={height} onChange={e => setHeight(e.target.value)} /></label><br />
        <label>Weight (lbs): <input value={weight} onChange={e => setWeight(e.target.value)} /></label><br />
        <button onClick={() => setEditing(false)}>Save & Start</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, paddingBottom: 80, maxWidth: 500, margin: "auto", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 style={{ margin: 0 }}>The 500 Plan</h2>
        <button onClick={() => setEditing(true)}>⚙️</button>
      </div>

      {screen === "home" && (
        <>
          <h3>Calories</h3>
          <div style={{ height: 20, background: "#eee", borderRadius: 10, overflow: "hidden" }}>
            <div
              style={{
                width: `${Math.min((calsToday / calorieGoal) * 100, 100)}%`,
                background: "#2196f3",
                height: "100%",
                transition: "width 0.3s ease",
              }}
            />
          </div>
          <p>{calsToday} / {calorieGoal} kcal</p>

          <h3>Protein</h3>
          <div style={{ height: 20, background: "#eee", borderRadius: 10, overflow: "hidden" }}>
            <div
              style={{
                width: `${Math.min((proteinToday / proteinGoal) * 100, 100)}%`,
                background: "#4caf50",
                height: "100%",
                transition: "width 0.3s ease",
              }}
            />
          </div>
          <p>{proteinToday} / {proteinGoal} g</p>

          <h4>Steps</h4>
          <input value={steps} onChange={e => setSteps(+e.target.value)} placeholder="Steps today" />
          <p>+{caloriesFromSteps} cal from steps</p>
        </>
      )}
    </div>
  );
}

export default App;
