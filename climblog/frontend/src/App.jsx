import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AddClimbForm from './components/AddClimbForm';
import ClimbList from './components/ClimbList';
import Home from './components/Home';
import Analytics from './components/Analytics';
import Login from './components/Login';
import Register from './components/Register';
import { API_BASE, authenticatedFetch } from './api';
import './index.css';

function AppContent() {
  const [climbs, setClimbs] = useState([]);
  const [page, setPage] = useState('home');
  const [editingClimb, setEditingClimb] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(null); // 'login' or 'register' or null
  const { isAuthenticated, logout, user, loading: authLoading } = useAuth();

  const refreshClimbs = () => {
    if (!isAuthenticated()) return;
    
    setLoading(true);
    setError(null);
    authenticatedFetch(`${API_BASE}/climbs`)
      .then(r => {
        if (!r.ok) {
          throw new Error('Failed to fetch climbs');
        }
        return r.json();
      })
      .then(setClimbs)
      .catch(err => {
        console.error('Error fetching climbs:', err);
        if (err.message === 'Unauthorized') {
          setError('Session expired. Please login again.');
          setPage('home');
        } else {
          setError('Failed to load climbs. Please try again.');
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isAuthenticated()) {
      refreshClimbs();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated()]);

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  const render = () => {
    switch (page) {
      case 'add':
        return <AddClimbForm onSuccess={() => { refreshClimbs(); setPage('home'); }} />;
      case 'edit':
        return <AddClimbForm climb={editingClimb} onSuccess={() => { refreshClimbs(); setEditingClimb(null); setPage('list'); }} onCancel={() => { setEditingClimb(null); setPage('list'); }} />;
      case 'list':
        return <ClimbList climbs={climbs} loading={loading} error={error} onRefresh={refreshClimbs} onEdit={(climb) => { setEditingClimb(climb); setPage('edit'); }} />;
      case 'analytics':
        return <Analytics climbs={climbs} loading={loading} error={error} />;
      default:
        return <Home refreshTrigger={climbs.length} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* NAV */}
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <h1 className="text-red-500 font-bold text-lg">ClimbLog</h1>
          <div className="flex items-center gap-3 text-sm">
            {isAuthenticated() ? (
              <>
                {user && (
                  <span className="text-gray-400 text-xs">Welcome, {user.username}</span>
                )}
                {[
                  { id: 'home', label: 'Home' },
                  { id: 'add', label: 'Log Climb' },
                  { id: 'list', label: 'Climbs' },
                  { id: 'analytics', label: 'Analytics' },
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
                <button
                  onClick={() => {
                    logout();
                    setPage('home');
                    setClimbs([]);
                  }}
                  className="px-3 py-1 rounded hover:bg-red-700/20 transition text-gray-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {[
                  { id: 'home', label: 'Home' },
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
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAuthModal('login')}
                    className="px-3 py-1 rounded hover:bg-red-700/20 transition text-gray-300"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setShowAuthModal('register')}
                    className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 transition text-white"
                  >
                    Register
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">{render()}</main>
      
      {/* Auth Modal/Overlay */}
      {showAuthModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAuthModal(null);
            }
          }}
        >
          <div className="bg-gray-800 rounded-lg max-w-md w-full relative">
            <button
              onClick={() => setShowAuthModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl leading-none"
              aria-label="Close"
            >
              ✕
            </button>
            {showAuthModal === 'register' ? (
              <Register
                onSuccess={() => {
                  setShowAuthModal(null);
                  setPage('home');
                  refreshClimbs();
                }}
                onSwitchToLogin={() => setShowAuthModal('login')}
              />
            ) : (
              <Login
                onSuccess={() => {
                  setShowAuthModal(null);
                  setPage('home');
                  refreshClimbs();
                }}
                onSwitchToRegister={() => setShowAuthModal('register')}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
