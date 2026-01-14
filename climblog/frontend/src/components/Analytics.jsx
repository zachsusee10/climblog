import { useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];

function Analytics({ climbs = [], loading = false, error = null }) {
  // Grade distribution data
  const gradeData = useMemo(() => {
    const gradeCounts = {};
    climbs.forEach(c => {
      if (c.grade) {
        gradeCounts[c.grade] = (gradeCounts[c.grade] || 0) + 1;
      }
    });
    return Object.entries(gradeCounts)
      .map(([grade, count]) => ({ grade, count }))
      .sort((a, b) => {
        // Sort by grade value (V0 < V1 < ... < V17)
        const aNum = parseInt(a.grade.replace('V', ''));
        const bNum = parseInt(b.grade.replace('V', ''));
        return aNum - bNum;
      });
  }, [climbs]);

  // Sends over time (grouped by month)
  const sendsOverTime = useMemo(() => {
    const monthlyData = {};
    climbs.forEach(c => {
      if (c.date) {
        const date = new Date(c.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { month: monthKey, sent: 0, attempted: 0 };
        }
        if (c.sent) {
          monthlyData[monthKey].sent += 1;
        } else {
          monthlyData[monthKey].attempted += 1;
        }
      }
    });
    return Object.values(monthlyData)
      .sort((a, b) => a.month.localeCompare(b.month))
      .map(item => ({
        ...item,
        month: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      }));
  }, [climbs]);

  // Attempts vs sends
  const attemptsVsSends = useMemo(() => {
    const sent = climbs.filter(c => c.sent).length;
    const attempted = climbs.filter(c => !c.sent).length;
    return [
      { name: 'Sent', value: sent, color: '#22c55e' },
      { name: 'Attempted', value: attempted, color: '#ef4444' }
    ];
  }, [climbs]);

  // Top gyms/locations
  const topGyms = useMemo(() => {
    const gymCounts = {};
    climbs.forEach(c => {
      if (c.gym) {
        gymCounts[c.gym] = (gymCounts[c.gym] || 0) + 1;
      }
    });
    return Object.entries(gymCounts)
      .map(([gym, count]) => ({ gym, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10
  }, [climbs]);

  // Overall stats
  const stats = useMemo(() => {
    const total = climbs.length;
    const sent = climbs.filter(c => c.sent).length;
    const attempted = total - sent;
    const sendRate = total > 0 ? ((sent / total) * 100).toFixed(1) : 0;
    
    // Hardest send
    const sentClimbs = climbs.filter(c => c.sent);
    const hardest = sentClimbs.length > 0 
      ? sentClimbs.reduce((max, c) => (c.difficulty > max.difficulty ? c : max), sentClimbs[0])
      : null;

    return { total, sent, attempted, sendRate, hardest };
  }, [climbs]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto mt-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-red-400 mb-2">Analytics</h2>
          <p className="text-gray-400">Your climbing statistics and insights</p>
        </div>
        <div className="bg-black p-12 rounded-lg shadow-lg border border-gray-800 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          <p className="text-gray-400 mt-4">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto mt-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-red-400 mb-2">Analytics</h2>
          <p className="text-gray-400">Your climbing statistics and insights</p>
        </div>
        <div className="bg-black p-12 rounded-lg shadow-lg border border-red-800 text-center">
          <p className="text-red-400 text-lg mb-2">⚠️ {error}</p>
          <p className="text-gray-500 text-sm mt-2">Unable to load analytics data.</p>
        </div>
      </div>
    );
  }

  if (climbs.length === 0) {
    return (
      <div className="max-w-6xl mx-auto mt-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-red-400 mb-2">Analytics</h2>
          <p className="text-gray-400">Your climbing statistics and insights</p>
        </div>
        <div className="bg-black p-12 rounded-lg shadow-lg border border-gray-800 text-center">
          <p className="text-gray-400 text-lg">No climbs logged yet.</p>
          <p className="text-gray-500 text-sm mt-2">Start logging climbs to see your analytics!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-red-400 mb-2">Analytics</h2>
        <p className="text-gray-400">Your climbing statistics and insights</p>
      </div>

      {/* Overall Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-black p-6 rounded-lg shadow-lg border border-gray-800">
          <div className="text-gray-400 text-sm mb-1">Total Climbs</div>
          <div className="text-3xl font-bold text-white">{stats.total}</div>
        </div>
        <div className="bg-black p-6 rounded-lg shadow-lg border border-gray-800">
          <div className="text-gray-400 text-sm mb-1">Sends</div>
          <div className="text-3xl font-bold text-green-400">{stats.sent}</div>
        </div>
        <div className="bg-black p-6 rounded-lg shadow-lg border border-gray-800">
          <div className="text-gray-400 text-sm mb-1">Send Rate</div>
          <div className="text-3xl font-bold text-red-400">{stats.sendRate}%</div>
        </div>
        <div className="bg-black p-6 rounded-lg shadow-lg border border-gray-800">
          <div className="text-gray-400 text-sm mb-1">Hardest Send</div>
          <div className="text-xl font-bold text-white">
            {stats.hardest ? stats.hardest.grade : 'N/A'}
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Grade Distribution */}
        <div className="bg-black p-6 rounded-lg shadow-lg border border-gray-800">
          <h3 className="text-xl font-semibold text-red-400 mb-4">Climbs by Grade</h3>
          {gradeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gradeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="grade" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#f3f4f6' }}
                />
                <Bar dataKey="count" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">No grade data available</p>
          )}
        </div>

        {/* Attempts vs Sends */}
        <div className="bg-black p-6 rounded-lg shadow-lg border border-gray-800">
          <h3 className="text-xl font-semibold text-red-400 mb-4">Sends vs Attempts</h3>
          {attemptsVsSends.some(item => item.value > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={attemptsVsSends}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {attemptsVsSends.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#f3f4f6' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </div>
      </div>

      {/* Sends Over Time - Full Width */}
      <div className="bg-black p-6 rounded-lg shadow-lg border border-gray-800 mb-6">
        <h3 className="text-xl font-semibold text-red-400 mb-4">Sends Over Time</h3>
        {sendsOverTime.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sendsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Legend />
              <Line type="monotone" dataKey="sent" stroke="#22c55e" strokeWidth={2} name="Sent" />
              <Line type="monotone" dataKey="attempted" stroke="#ef4444" strokeWidth={2} name="Attempted" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-8">No date data available</p>
        )}
      </div>

      {/* Top Gyms */}
      <div className="bg-black p-6 rounded-lg shadow-lg border border-gray-800">
        <h3 className="text-xl font-semibold text-red-400 mb-4">Top Locations</h3>
        {topGyms.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topGyms} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis dataKey="gym" type="category" stroke="#9ca3af" width={120} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-8">No location data available</p>
        )}
      </div>
    </div>
  );
}

export default Analytics;

