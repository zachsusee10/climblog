import { useEffect, useState } from 'react'
import { API_BASE, authenticatedFetch } from '../api'
import { useAuth } from '../context/AuthContext'

export default function Home({ refreshTrigger }) {
  const { isAuthenticated } = useAuth();
  const [recentClimb, setRecentClimb] = useState(null)
  const [hardestClimb, setHardestClimb] = useState(null)
  const [loadingRecent, setLoadingRecent] = useState(true)
  const [loadingHardest, setLoadingHardest] = useState(true)

  const fetchRecent = () => {
    if (!isAuthenticated()) {
      setLoadingRecent(false);
      setRecentClimb(null);
      return;
    }
    setLoadingRecent(true);
    
    const token = localStorage.getItem('climblog_token');
    if (!token) {
      setLoadingRecent(false);
      setRecentClimb(null);
      return;
    }
    
    fetch(`${API_BASE}/climbs/most-recent`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (!res.ok) {
          // 404 means no data, 403 might mean no data or auth issue
          if (res.status === 404) {
            setRecentClimb(null);
            return;
          }
          // For 403, try to parse error or just treat as no data
          if (res.status === 403) {
            console.warn('403 Forbidden - authentication may have failed');
            setRecentClimb(null);
            return;
          }
          // Other errors
          setRecentClimb(null);
          return;
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setRecentClimb(data);
        } else {
          setRecentClimb(null);
        }
      })
      .catch(err => {
        console.error("Error fetching recent climb:", err);
        // Don't set error - just show "no climbs yet"
        setRecentClimb(null);
      })
      .finally(() => setLoadingRecent(false));
  };

  const fetchHardest = () => {
    if (!isAuthenticated()) {
      setLoadingHardest(false);
      setHardestClimb(null);
      return;
    }
    setLoadingHardest(true);
    
    const token = localStorage.getItem('climblog_token');
    if (!token) {
      setLoadingHardest(false);
      setHardestClimb(null);
      return;
    }
    
    fetch(`${API_BASE}/climbs/hardest-send`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (!res.ok) {
          // 404 means no data, 403 might mean no data or auth issue
          if (res.status === 404) {
            setHardestClimb(null);
            return;
          }
          // For 403, try to parse error or just treat as no data
          if (res.status === 403) {
            console.warn('403 Forbidden - authentication may have failed');
            setHardestClimb(null);
            return;
          }
          // Other errors
          setHardestClimb(null);
          return;
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setHardestClimb(data);
        } else {
          setHardestClimb(null);
        }
      })
      .catch(err => {
        console.error("Error fetching hardest send:", err);
        // Don't set error just show "no sends yet"
        setHardestClimb(null);
      })
      .finally(() => setLoadingHardest(false));
  };

  useEffect(() => {
    fetchRecent();
  }, [isAuthenticated()]) 

  useEffect(() => {
    fetchHardest();
  }, [isAuthenticated()])

  // Refresh when climbs are added/updated
  useEffect(() => {
    if (refreshTrigger) {
      fetchRecent();
      fetchHardest();
    }
  }, [refreshTrigger]) 
  return(
    <section className="space-y-10">
      <header className="text-center space-y-1">
        <h2 className="text-3xl font-bold text-red-500">ClimbLog</h2>
        <p className="text-gray-400">Track your climbing progress</p>
      </header>

      {!isAuthenticated() ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg mb-4">Welcome to ClimbLog!</p>
          <p className="text-gray-500 text-sm">Login or register to start tracking your climbing progress.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Most recent */}
          <article className="bg-gray-900 rounded p-6 space-y-3">
            <h3 className="text-lg font-semibold text-red-400">Most Recent Climb</h3>
            {loadingRecent ? (
              <div className="flex items-center gap-2">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                <p className="text-gray-400 text-sm">Loading...</p>
              </div>
            ) : recentClimb ? (
              <div className="text-sm space-y-1">
                <p className="font-medium text-white">{recentClimb.name}</p>
                <div className="flex items-center gap-2">
                  <span className="bg-red-600 text-white px-2 py-0.5 rounded text-xs font-bold">
                    {recentClimb.grade}
                  </span>
                  <span className="text-gray-400">{recentClimb.date}</span>
                </div>
                {recentClimb.gym && (
                  <p className="text-gray-400 text-xs">📍 {recentClimb.gym}</p>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm">No climbs logged yet</p>
                <p className="text-gray-600 text-xs mt-1">Start by logging your first climb!</p>
              </div>
            )}
          </article>

          {/* Hardest send */}
          <article className="bg-gray-900 rounded p-6 space-y-3">
            <h3 className="text-lg font-semibold text-red-400">Hardest Send</h3>
            {loadingHardest ? (
              <div className="flex items-center gap-2">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                <p className="text-gray-400 text-sm">Loading...</p>
              </div>
            ) : hardestClimb?.name ? (
              <div className="text-sm space-y-1">
                <p className="font-medium text-white">{hardestClimb.name}</p>
                <div className="flex items-center gap-2">
                  <span className="bg-red-600 text-white px-2 py-0.5 rounded text-xs font-bold">
                    {hardestClimb.grade}
                  </span>
                  <span className="text-gray-400">{hardestClimb.type}</span>
                </div>
                {hardestClimb.gym && (
                  <p className="text-gray-400 text-xs">📍 {hardestClimb.gym}</p>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm">No sends yet</p>
                <p className="text-gray-600 text-xs mt-1">Complete a climb to see it here!</p>
              </div>
            )}
          </article>
        </div>
      )}
    </section>
  ) ;
  }