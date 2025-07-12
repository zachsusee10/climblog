import { useEffect, useState } from 'react'
import './App.css'
import AddClimbForm from './components/AddClimbForm';
import ClimbList from './components/ClimbList';

function App() {
  const [climbs, setClimbs] = useState([])
  const BASE = "http://localhost:8080/climbs/api"

  useEffect(() => {
    fetch(`${BASE}/allclimbs`) 
      .then(res => res.json())
      .then(data => setClimbs(data))
      .catch(err => console.error("Error fetching climbs:", err))
  }, []) // only run once when the component mounts
  return (
    <div>
      <h1>ClimbLog</h1>
      <AddClimbForm />
      <ClimbList climbs={climbs} />
    </div>
  );
}

export default App
