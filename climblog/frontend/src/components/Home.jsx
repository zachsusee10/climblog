import { useEffect, useState } from 'react'

export default function Home() {

  const [recentClimb, setRecentClimb] = useState([])
  const [hardestClimb, setHardestClimb] = useState([])
  const BASE = "http://localhost:8080/climbs/api"

  useEffect(() => {
    fetch(`${BASE}/mostrecent`) 
      .then(res => res.json())
      .then(data => setRecentClimb(data))
      .catch(err => console.error("Error fetching climbs:", err))
  }, []) 

  useEffect(() => {
    fetch(`${BASE}/hardestSend`) 
      .then(res => res.json())
      .then(data => setHardestClimb(data))
      .catch(err => console.error("Error fetching climbs:", err))
  }, []) 
  return(
    <div>
   <h2>🏠 Welcome to ClimbLog!</h2>
   <div>
    {recentClimb.map(c => (
      <div key={c.id}>
        <h2>{c.name}</h2>
        <p>{c.date}</p>
      </div>
    ))}
    </div>
    <div>
      <div key={hardestClimb.id}>
        <h2>{hardestClimb.name}</h2>
        <p>{hardestClimb.grade}</p>
      </div>
    </div>
    </div>
  ) ;
  }