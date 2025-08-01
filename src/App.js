// The 500 Plan - Lite Version
// Based on EatLiftBurn but simplified for calories, protein, steps, and weight only

import React, { useState, useEffect } from "react";

function App() {
  const [screen, setScreen] = useState("home");
  const [sex, setSex] = useState(() => localStorage.getItem("sex") || "male");
  const [age, setAge] = useState(() => localStorage.getItem("age") || "");
  const [height, setHeight] = useState(() => localStorage.getItem("height") || "");
  const [weight, setWeight] = useState(() => localStorage.getItem("weight") || "");
  const [editing, setEditing] = useState(!sex || !age || !height || !weight);

  const [calories, setCalories] = useState(() => parseInt(localStorage.getItem("calories")) || 0);
  const [protein, setProtein] = useState(() => parseInt(localStorage.getItem("protein")) || 0);
  const [steps, setSteps] = useState(() => parseInt(localStorage.getItem("steps")) || 0);
  const [weightLog, setWeightLog] = useState(() => JSON.parse(localStorage.getItem("weightLog")) || []);
  const [newWeight, setNewWeight] = useState("");

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
    localStorage.setItem("sex", sex);
    localStorage.setItem("age", age);
    localStorage.setItem("height", height);
    localStorage.setItem("weight", weight);
    localStorage.setItem("calories", calories);
    localStorage.setItem("protein", protein);
    localStorage.setItem("steps", steps);
    localStorage.setItem("weightLog", JSON.stringify(weightLog));
  }, [sex, age, height, weight, calories, protein, steps, weightLog]);

  const resetDay = () => {
    setCalories(0);
    setProtein(0);
    setSteps(0);
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
        <h2>Set Up</h2>
        <label>Sex:
          <select value={sex} onChange={e => setSex(e.target.value)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label><br />
        <label>Age: <input value={age} onChange={e => setAge(e.target.value)} /></label><br />
        <label>Height (inches): <input value={height} onChange={e => setHeight(e.target.value)} /></label><br />
        <label>Weight (lbs): <input value={weight} onChange={e => setWeight(e.target.value)} /></label><br />
        <button onClick={() => setEditing(false)}>Save</button>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 80, paddingTop: 24, maxWidth: 500, margin: "auto", fontFamily: "Arial" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>The 500 Plan</h2>
        <button onClick={() => setEditing(true)}>⚙️</button>
      </div>

      {screen === "home" && (
        <>
          <h3>Calories</h3>
          <progress max={calorieGoal} value={calories} style={{ width: "100%" }} />
          <p>{calories} / {calorieGoal} kcal</p>

          <h3>Protein</h3>
          <progress max={proteinGoal} value={protein} style={{ width: "100%" }} />
          <p>{protein} / {proteinGoal} g</p>

          <h4>Steps</h4>
          <input value={steps} onChange={e => setSteps(+e.target.value)} placeholder="Steps" />
          <p>+{caloriesFromSteps} cal</p>

          <button onClick={resetDay} style={{ marginTop: 10 }}>Reset Day</button>
        </>
      )}

      {screen === "food" && (
        <>
          <h3>Add Food</h3>
          <input placeholder="Calories" onChange={e => setCalories(calories + +e.target.value)} />
          <input placeholder="Protein" onChange={e => setProtein(protein + +e.target.value)} />
        </>
      )}

      {screen === "weight" && (
        <>
          <h3>Weight</h3>
          <input placeholder="Enter weight" value={newWeight} onChange={e => setNewWeight(e.target.value)} />
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
