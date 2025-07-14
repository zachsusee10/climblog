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
    <section className="space-y-10">
      <header className="text-center space-y-1">
        <h2 className="text-3xl font-bold text-red-500">ClimbLog</h2>
        <p className="text-gray-400">Track your climbing progress</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Most recent */}
        <article className="bg-gray-900 rounded p-6 space-y-3">
          <h3 className="text-lg font-semibold text-red-400">Most Recent Climb</h3>
          {recentClimb.map(c => (
            <div key={c.id} className="text-sm space-y-1">
              <p className="font-medium">{c.name}</p>
              <p className="text-gray-400">{c.date}</p>
            </div>
          ))}
        </article>

        {/* Hardest send */}
        <article className="bg-gray-900 rounded p-6 space-y-3">
          <h3 className="text-lg font-semibold text-red-400">Hardest Send</h3>
          {hardestClimb?.name ? (
            <div className="flex items-center gap-2 text-sm">
              <span>{hardestClimb.name}</span>
              <span className="bg-red-600 text-white px-2 py-0.5 rounded">
                {hardestClimb.grade}
              </span>
            </div>
          ) : (
            <p className="text-gray-500">No sends yet</p>
          )}
        </article>
      </div>
    </section>
  ) ;
  }