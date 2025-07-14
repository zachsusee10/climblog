function ClimbList({ climbs }) {
  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-red-400 mb-2">Climb Metrics</h2>
        <p className="text-gray-400">Your climbing history and progress</p>
      </div>

      <div className="grid gap-4">
        {climbs.map(c => (
          <div key={c.id} className="bg-black p-6 rounded-lg shadow-lg border border-gray-800 hover:border-red-500 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">{c.name}</h3>
                <p className="text-gray-400 text-sm">{c.gym} • {c.date}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {c.grade}
                </span>
                <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                  {c.type}
                </span>
                {c.sent && (
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    ✓ Sent
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ClimbList
