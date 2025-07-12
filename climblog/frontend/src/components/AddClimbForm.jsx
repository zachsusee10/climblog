import { useEffect, useState } from 'react'

function AddClimbForm() {
  const GRADES = ['V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'V11', 'V12', 'V13', 'V14', 'V15', 'V16', 'V17',]
  const TYPES = ['Boulder', 'Top Rope', 'Lead', 'Solo']
  const BASE = "http://localhost:8080/climbs/api"

  const [name, setName] = useState("");
  const [grade, setGrade] = useState(GRADES[0]);
  const [type, setType] = useState(TYPES[0]);
  const [sent, setSent] = useState(false);
  const [gym, setGym] = useState("")
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("your mom")
    console.log("name:", name);
    console.log("grade:", grade);
    console.log("type:", type);
    if (!name || !grade || !type || !gym || !date) 
      {
      alert("Please fill out all required fields.");
      return;
      }

    const newClimb = { name, grade, type, gym, sent, date };
    fetch(`${BASE}/addclimb`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newClimb)
    })
      .then(res => res.json())
      .then(data => {
        console.log("Climb added!", data);
        setName("");
        setGrade("");
        setType("");
        setSent(false);
        setGym("");
        setDate("");
      })
      .catch(err => console.error("Error adding climb", err));
  };

  return (
  <div>
    <p>form loaded</p>
  <form onSubmit= {handleSubmit}>
    <label>Name:
      <input 
      type="text" 
      value={name} 
      onChange={(e) => setName(e.target.value)}
      />
    </label>
    <label>Gym:
      <input 
      type="text" 
      value={gym} 
      onChange={(e) => setGym(e.target.value)}
      />
    </label>
    <label>
      Sent? 
      <input
        type="checkbox"
        checked={sent}
        onChange={(e) => setSent(e.target.checked)}
      />
    </label>
    <select value={grade} onChange={(e) => setGrade(e.target.value)}>
      {GRADES.map(g => (
        <option key={g} value={g}>{g}</option>
      ))}
    </select>
    <select value={type} onChange={(e) => setType(e.target.value)}>
      {TYPES.map(t => (
        <option key={t} value={t}>{t}</option>
      ))}
    </select>
    <label>
      Date:
      <input 
        type="date" 
        value={date} 
        onChange={(e) => setDate(e.target.value)}
      />
    </label>
    <button type='submit'>Add Climb</button>
  </form>
  </div>
  )
}

export default AddClimbForm
