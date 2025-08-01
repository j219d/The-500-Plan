import React, { useState, useEffect } from "react";

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
  const [screen, setScreen] = useState("home");
  const [sex, setSex] = useState(() => localStorage.getItem("sex") || "male");
  const [age, setAge] = useState(() => localStorage.getItem("age") || "");
  const [height, setHeight] = useState(() => localStorage.getItem("height") || "");
  const [weight, setWeight] = useState(() => localStorage.getItem("weight") || "");
  const [editing, setEditing] = useState(!sex || !age || !height || !weight);

  const [calsToday, setCalsToday] = useState(0);
  const [proteinToday, setProteinToday] = useState(0);
  const [steps, setSteps] = useState(0);
  const [weightLog, setWeightLog] = useState([]);
  const [newWeight, setNewWeight] = useState("");

  const [search, setSearch] = useState("");
  const [foodList, setFoodList] = useState([]);
  const [foodLog, setFoodLog] = useState([]);

  const [customName, setCustomName] = useState("");
  const [customCal, setCustomCal] = useState("");
  const [customProt, setCustomProt] = useState("");

  const caloriesFromSteps = Math.round(steps * 0.04);

  const bmr = () => {
    const h = parseInt(height);
    const w = parseFloat(weight);
    const a = parseInt(age);
    if (!h || !w || !a) return 1600;
    const heightCm = h * 2.54;
    const weightKg = w * 0.453592;
    return Math.round(
      sex === "male"
        ? 10 * weightKg + 6.25 * heightCm - 5 * a + 5
        : 10 * weightKg + 6.25 * heightCm - 5 * a - 161
    );
  };

  const calorieGoal = bmr() - 500 + caloriesFromSteps;
  const proteinGoal = Math.round(parseFloat(weight) * 0.8);

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
    setCalsToday(calsToday + cals);
    setProteinToday(proteinToday + pro);
    setFoodLog([...foodLog, { name: namePart, cal: cals, prot: pro }]);
    setSearch("");
    setFoodList([]);
  };

  const addCustomFood = () => {
    const cals = parseFloat(customCal);
    const pro = parseFloat(customProt);
    if (!isNaN(cals) && !isNaN(pro) && customName) {
      setCalsToday(calsToday + cals);
      setProteinToday(proteinToday + pro);
      setFoodLog([...foodLog, { name: customName, cal: cals, prot: pro }]);
      setCustomName("");
      setCustomCal("");
      setCustomProt("");
    }
  };

  const addWeight = () => {
    const w = parseFloat(newWeight);
    if (!isNaN(w)) {
      const today = new Date().toLocaleDateString();
      setWeightLog([...weightLog, { date: today, weight: w }]);
      setNewWeight("");
    }
  };

  if (editing) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Setup</h2>
        <label>Sex: <select value={sex} onChange={e => setSex(e.target.value)}><option>male</option><option>female</option></select></label><br />
        <label>Age: <input value={age} onChange={e => setAge(e.target.value)} /></label><br />
        <label>Height (inches): <input value={height} onChange={e => setHeight(e.target.value)} /></label><br />
        <label>Weight (lbs): <input value={weight} onChange={e => setWeight(e.target.value)} /></label><br />
        <button onClick={() => setEditing(false)}>Save</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, paddingBottom: 80, maxWidth: 500, margin: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>The 500 Plan</h2>
        <button onClick={() => setEditing(true)}>⚙️</button>
      </div>

      {screen === "home" && (
        <>
          <h3>Calories</h3>
          <progress max={calorieGoal} value={calsToday} style={{ width: "100%" }} />
          <p>{calsToday} / {calorieGoal} kcal</p>

          <h3>Protein</h3>
          <progress max={proteinGoal} value={proteinToday} style={{ width: "100%" }} />
          <p>{proteinToday} / {proteinGoal} g</p>

          <h4>Steps</h4>
          <input value={steps} onChange={e => setSteps(+e.target.value)} placeholder="Steps" />
          <p>+{caloriesFromSteps} cal</p>
        </>
      )}

      {screen === "food" && (
        <>
          <h3>Food Search</h3>
          <input placeholder="Search food..." value={search} onChange={e => setSearch(e.target.value)} />
          {foodList.length > 0 && (
            <ul style={{ background: '#f2f2f2', padding: 8, borderRadius: 4, listStyle: 'none' }}>
              {foodList.map((f, idx) => (
                <li key={idx} onClick={() => handlePresetSelect(f)} style={{ padding: 4, cursor: 'pointer' }}>
                  {f}
                </li>
              ))}
            </ul>
          )}

          <h4>Or Enter Manually</h4>
          <input placeholder="Food name" value={customName} onChange={e => setCustomName(e.target.value)} />
          <input placeholder="Calories" type="number" value={customCal} onChange={e => setCustomCal(e.target.value)} />
          <input placeholder="Protein" type="number" value={customProt} onChange={e => setCustomProt(e.target.value)} />
          <button onClick={addCustomFood}>Add Food</button>

          <h4>Logged Foods Today</h4>
          <ul>
            {foodLog.map((item, idx) => (
              <li key={idx}>{item.name} — {item.cal} kcal / {item.prot}g protein</li>
            ))}
          </ul>
        </>
      )}

      {screen === "weight" && (
        <>
          <h3>Track Weight</h3>
          <input placeholder="Today's weight" value={newWeight} onChange={e => setNewWeight(e.target.value)} />
          <button onClick={addWeight}>Log</button>
          <ul>
            {weightLog.map((w, i) => (
              <li key={i}>{w.date}: {w.weight} lb</li>
            ))}
          </ul>
        </>
      )}

      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        display: "flex", justifyContent: "space-around",
        background: "#fff", borderTop: "1px solid #ccc"
      }}>
        <button style={{ flex: 1, padding: 16, fontSize: 18 }} onClick={() => setScreen("home")}>Home</button>
        <button style={{ flex: 1, padding: 16, fontSize: 18 }} onClick={() => setScreen("food")}>Food</button>
        <button style={{ flex: 1, padding: 16, fontSize: 18 }} onClick={() => setScreen("weight")}>Weight</button>
      </div>
    </div>
  );
}

export default App;
