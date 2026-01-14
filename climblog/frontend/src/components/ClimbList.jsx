import { useState, useMemo } from 'react';
import { API_BASE, authenticatedFetch } from '../api';

function ClimbList({ climbs = [], loading = false, error = null, onRefresh, onEdit }) {
  const GRADES = ['V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'V11', 'V12', 'V13', 'V14', 'V15', 'V16', 'V17'];
  const TYPES = ['Boulder', 'Top Rope', 'Sport', 'Trad', 'Solo'];

  const [searchName, setSearchName] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterSent, setFilterSent] = useState('');
  const [filterGym, setFilterGym] = useState('');

  const uniqueGyms = useMemo(() => {
    if (!climbs || climbs.length === 0) return [];
    const gyms = [...new Set(climbs.map(c => c.gym).filter(Boolean))].sort();
    return gyms;
  }, [climbs]);

  const filteredClimbs = useMemo(() => {
    if (!climbs || climbs.length === 0) return [];
    return climbs.filter(c => {
      const matchesName = !searchName || c.name?.toLowerCase().includes(searchName.toLowerCase());
      const matchesGrade = !filterGrade || c.grade === filterGrade;
      const matchesType = !filterType || c.type === filterType;
      const matchesSent = filterSent === '' || 
        (filterSent === 'sent' && c.sent) || 
        (filterSent === 'attempted' && !c.sent);
      const matchesGym = !filterGym || c.gym === filterGym;
      
      return matchesName && matchesGrade && matchesType && matchesSent && matchesGym;
    });
  }, [climbs, searchName, filterGrade, filterType, filterSent, filterGym]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchName) count++;
    if (filterGrade) count++;
    if (filterType) count++;
    if (filterSent) count++;
    if (filterGym) count++;
    return count;
  }, [searchName, filterGrade, filterType, filterSent, filterGym]);

  const clearFilters = () => {
    setSearchName('');
    setFilterGrade('');
    setFilterType('');
    setFilterSent('');
    setFilterGym('');
  };

  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await authenticatedFetch(`${API_BASE}/climbs/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        onRefresh();
      } else {
        alert('Failed to delete climb. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting climb:', error);
      alert('Error deleting climb. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-red-400 mb-2">Climbs</h2>
          <p className="text-gray-400">Your climbing history and progress</p>
        </div>
        <div className="bg-black p-12 rounded-lg shadow-lg border border-gray-800 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          <p className="text-gray-400 mt-4">Loading climbs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-red-400 mb-2">Climbs</h2>
          <p className="text-gray-400">Your climbing history and progress</p>
        </div>
        <div className="bg-black p-12 rounded-lg shadow-lg border border-red-800 text-center">
          <p className="text-red-400 text-lg mb-2">⚠️ {error}</p>
          <button
            onClick={onRefresh}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!climbs || climbs.length === 0) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-red-400 mb-2">Climbs</h2>
          <p className="text-gray-400">Your climbing history and progress</p>
        </div>
        <div className="bg-black p-12 rounded-lg shadow-lg border border-gray-800 text-center">
          <p className="text-gray-400 text-lg">No climbs logged yet.</p>
          <p className="text-gray-500 text-sm mt-2">Start by logging your first climb!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-red-400 mb-2">Climbs</h2>
        <p className="text-gray-400">Your climbing history and progress</p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-black p-6 rounded-lg shadow-lg border border-gray-800 mb-6" data-testid="search-filters">
        <div className="space-y-4">
          {/* Search Bar */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search by Name
            </label>
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Search climbs..."
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Grade Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Grade
              </label>
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">All Grades</option>
                {GRADES.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                {TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Sent Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <select
                value={filterSent}
                onChange={(e) => setFilterSent(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">All</option>
                <option value="sent">Sent</option>
                <option value="attempted">Attempted</option>
              </select>
            </div>

            {/* Gym Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Gym/Location
              </label>
              <select
                value={filterGym}
                onChange={(e) => setFilterGym(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">All Locations</option>
                {uniqueGyms.map(gym => (
                  <option key={gym} value={gym}>{gym}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Summary and Clear */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-800">
            <div className="text-sm text-gray-400">
              Showing <span className="text-red-400 font-semibold">{filteredClimbs.length}</span> of <span className="text-gray-300">{climbs.length}</span> climbs
              {activeFilterCount > 0 && (
                <span className="ml-2">({activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active)</span>
              )}
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-red-400 hover:text-red-300 transition underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredClimbs.length === 0 ? (
        <div className="bg-black p-12 rounded-lg shadow-lg border border-gray-800 text-center">
          <p className="text-gray-400 text-lg">No climbs match your filters.</p>
          <p className="text-gray-500 text-sm mt-2">Try adjusting your search criteria.</p>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="mt-4 text-red-400 hover:text-red-300 transition underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredClimbs.map(c => (
            <div key={c.id} className="bg-black p-6 rounded-lg shadow-lg border border-gray-800 hover:border-red-500 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
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
                <button
                  onClick={() => onEdit(c)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition"
                  title="Edit climb"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c.id, c.name)}
                  disabled={deletingId === c.id}
                  className="bg-red-700 hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-1 rounded text-sm font-medium transition"
                  title="Delete climb"
                >
                  {deletingId === c.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  )
}

export default ClimbList
