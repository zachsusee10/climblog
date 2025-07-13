import { useEffect, useState } from 'react'
import './App.css'
import { Routes, Route, Link } from 'react-router-dom'
import AddClimbForm from './components/AddClimbForm'
import ClimbList from './components/ClimbList'
import Home from './components/Home'

function App() {
  const [climbs, setClimbs] = useState([])
  const BASE = "http://localhost:8080/climbs/api"

  useEffect(() => {
    fetch(`${BASE}/allclimbs`) 
      .then(res => res.json())
      .then(data => setClimbs(data))
      .catch(err => console.error("Error fetching climbs:", err))
  }, []) 
  
  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/add">Log</Link>
        <Link to="/list">Metrics</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddClimbForm />} />
        <Route path="/list" element={<ClimbList climbs={climbs} />} />
      </Routes>
    </>
  )
}

export default App
