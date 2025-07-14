import { useEffect, useState } from 'react';
import AddClimbForm from './components/AddClimbForm';
import ClimbList from './components/ClimbList';
import Home from './components/Home';
import './index.css';

export default function App() {
  const [climbs, setClimbs] = useState([]);
  const [page, setPage] = useState('home');
  const BASE = 'http://localhost:8080/climbs/api';

  useEffect(() => {
    fetch(`${BASE}/allclimbs`)
      .then(r => r.json())
      .then(setClimbs)
      .catch(console.error);
  }, []);

  const render = () => {
    switch (page) {
      case 'add':
        return <AddClimbForm />;
      case 'list':
        return <ClimbList climbs={climbs} />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* NAV */}
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <h1 className="text-red-500 font-bold text-lg">ClimbLog</h1>
          <div className="flex gap-3 text-sm">
            {[
              { id: 'home', label: 'Home' },
              { id: 'add', label: 'Log Climb' },
              { id: 'list', label: 'Metrics' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setPage(id)}
                className={`px-3 py-1 rounded hover:bg-red-700/20 transition ${
                  page === id ? 'text-red-400' : 'text-gray-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">{render()}</main>
    </div>
  )
}
