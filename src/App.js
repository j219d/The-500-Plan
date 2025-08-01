import React, { useState, useEffect } from "react";

const presetFoods = [
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
  "Bread (sourdough rye slice 56g) - 145 kcal / 4.5g protein",
  "Butter (1 tsp) - 35 kcal / 0g protein",
  "Butter (1 tbsp) - 102 kcal / 0.1g protein",
  "Carrot (100g) - 41 kcal / 0.9g protein",
  "Chicken breast (100g) - 165 kcal / 31g protein",
  "Cottage cheese 5% (100g) - 95 kcal / 11g protein",
  "Egg - 70 kcal / 6g protein",
  "Eggs (2), Egg white (1) + butter - 190 kcal / 15g protein",
  "Greek Yogurt - 100 kcal / 10g protein",
  "Oats (½ cup) - 146 kcal / 4.8g protein",
  "Protein bar (quest cookie dough) - 190 kcal / 21g protein",
  "Protein scoop (1 Promix Chocolate) - 80 kcal / 15.5g protein",
  "Rice (100g cooked) - 130 kcal / 2.6g protein",
  "Salmon (100g) - 206 kcal / 22g protein",
  "Spinach (frozen, 100g) - 28 kcal / 3.2g protein",
  "Strawberries (1 cup) - 49 kcal / 1g protein",
  "Sweet potato (100g) - 86 kcal / 2g protein",
  "Tomato - 20 kcal / 1g protein",
  "Tuna (150g) - 156 kcal / 37.2g protein",
  "Yogurt 0% - 117 kcal / 20g protein"
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

  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [search, setSearch] = useState("");
  const [foodList, setFoodList] = useState([]);

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
    if (search.length > 0) {
      const results = presetFoods.filter(f => f.toLowerCase().includes(search.toLowerCase()));
      setFoodList(results);
    } else {
      setFoodList([]);
    }
  }, [search]);

  const handlePresetSelect = (food) => {
    const [namePart, values] = food.split(" - ");
    const [kcal, prot] = values.replace(/kcal|protein/g, "").split("/");
    setFoodName(namePart.trim());
    setCalories(kcal.trim());
    setProtein(prot.trim());
    setSearch("");
    setFoodList([]);
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
          <h3>Add Food</h3>
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
          <input placeholder="Food name" value={foodName} onChange={e => setFoodName(e.target.value)} />
          <input placeholder="Calories" type="number" value={calories} onChange={e => setCalories(e.target.value)} />
          <input placeholder="Protein" type="number" value={protein} onChange={e => setProtein(e.target.value)} />
          <button onClick={() => {
            setCalsToday(calsToday + Number(calories));
            setProteinToday(proteinToday + Number(protein));
            setFoodName("");
            setCalories("");
            setProtein("");
          }}>Add Food</button>
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
        background: "#fff", padding: 12, borderTop: "1px solid #ccc"
      }}>
        <button onClick={() => setScreen("home")}>🏠</button>
        <button onClick={() => setScreen("food")}>🍽</button>
        <button onClick={() => setScreen("weight")}>⚖️</button>
      </div>
    </div>
  );
}

export default App;
