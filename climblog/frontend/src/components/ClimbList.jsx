import { useEffect, useState } from 'react'

function ClimbList({ climbs }) {
  return (
    <div>
    {climbs.map(c => (
      <div key={c.id}>
        <h2>{c.name}</h2>
        <p>{c.grade}</p>
      </div>
    ))}
    </div>
  )
}

export default ClimbList
