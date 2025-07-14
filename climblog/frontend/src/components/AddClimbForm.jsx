import { useEffect, useState } from 'react'

function AddClimbForm() {
  const GRADES = ['V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'V11', 'V12', 'V13', 'V14', 'V15', 'V16', 'V17',]
  const TYPES = ['Boulder', 'Top Rope', 'Sport', 'Trad', 'Solo']
  const BASE = "http://localhost:8080/climbs/api"

  const [name, setName] = useState("");
  const [grade, setGrade] = useState(GRADES[0]);
  const [difficulty, setDifficulty] = useState(0);
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

    const newClimb = { name, grade, type, difficulty, gym, sent, date };
    fetch(`${BASE}/addclimb`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newClimb)
    })
      .then(res => res.json())
      .then(data => {
        console.log("Climb added!", data);
        setName("");
        setGrade(GRADES[0]);
        setDifficulty(0);
        setType(TYPES[0]);
        setSent(false);
        setGym("");
        setDate("");
      })
      .catch(err => console.error("Error adding climb", err));
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
    <div className="bg-black p-8 rounded-lg shadow-2xl border border-gray-800">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-red-400 mb-2">Log New Climb</h2>
        <p className="text-gray-400">Add your latest climbing session</p>
      </div>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Climb Name *
            </label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter climb name..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Gym/Location *
            </label>
            <input 
              type="text" 
              value={gym} 
              onChange={(e) => setGym(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter gym or location..."
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Grade *
            </label>
            <select 
              value={grade} 
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {GRADES.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Type *
            </label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Date *
          </label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={sent}
            onChange={(e) => setSent(e.target.checked)}
            className="w-5 h-5 text-green-600 bg-gray-900 border-gray-700 rounded focus:ring-green-500 focus:ring-2"
          />
          <label className="ml-3 text-sm font-medium text-gray-300">
            Successfully sent this climb
          </label>
        </div>

        <button 
          type="button"
          onClick={handleSubmit}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg"
        >
          Add Climb
        </button>
      </div>
    </div>
  </div>
  )
}

export default AddClimbForm
