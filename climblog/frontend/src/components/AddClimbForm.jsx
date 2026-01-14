import { useEffect, useState } from 'react'
import { API_BASE, authenticatedFetch } from '../api'

function AddClimbForm({ climb, onSuccess, onCancel }) {
  const GRADES = ['V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'V11', 'V12', 'V13', 'V14', 'V15', 'V16', 'V17',]
  const TYPES = ['Boulder', 'Top Rope', 'Sport', 'Trad', 'Solo']
  const isEditing = !!climb;

  const [name, setName] = useState("");
  const [grade, setGrade] = useState(GRADES[0]);
  const [type, setType] = useState(TYPES[0]);
  const [sent, setSent] = useState(false);
  const [gym, setGym] = useState("")
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (climb) {
      setName(climb.name || "");
      setGrade(climb.grade || GRADES[0]);
      setType(climb.type || TYPES[0]);
      setSent(climb.sent || false);
      setGym(climb.gym || "");
      // Format date for input 
      if (climb.date) {
        const dateStr = climb.date.split('T')[0]; // Handle ISO date strings
        setDate(dateStr);
      } else {
        setDate("");
      }
    } else {
      // Reset form for new climb
      setName("");
      setGrade(GRADES[0]);
      setType(TYPES[0]);
      setSent(false);
      setGym("");
      setDate("");
    }
  }, [climb]);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Climb name is required';
    if (!gym.trim()) newErrors.gym = 'Gym/location is required';
    if (!date) newErrors.date = 'Date is required';
    if (!grade) newErrors.grade = 'Grade is required';
    if (!type) newErrors.type = 'Type is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(false);
    
    if (!validate()) {
      return;
    }

    setLoading(true);
    // don't need difficulty
    const climbData = { name, grade, type, gym, sent, date };
    const url = isEditing ? `${API_BASE}/climbs/${climb.id}` : `${API_BASE}/climbs`;
    const method = isEditing ? "PUT" : "POST";

    authenticatedFetch(url, {
      method: method,
      body: JSON.stringify(climbData)
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to ${isEditing ? 'update' : 'add'} climb`);
        }
        return res.json();
      })
      .then(data => {
        console.log(`Climb ${isEditing ? 'updated' : 'added'}!`, data);
        setSuccess(true);
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          }
        }, 500);
      })
      .catch(err => {
        console.error(`Error ${isEditing ? 'updating' : 'adding'} climb`, err);
        setErrors({ submit: `Failed to ${isEditing ? 'update' : 'add'} climb. Please try again.` });
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
    <div className="bg-black p-8 rounded-lg shadow-2xl border border-gray-800">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-red-400 mb-2">
          {isEditing ? 'Edit Climb' : 'Log New Climb'}
        </h2>
        <p className="text-gray-400">
          {isEditing ? 'Update climb details' : 'Add your latest climbing session'}
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Climb Name *
            </label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: null });
              }}
              className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-700'
              }`}
              placeholder="Enter climb name..."
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Gym/Location *
            </label>
            <input 
              type="text" 
              value={gym} 
              onChange={(e) => {
                setGym(e.target.value);
                if (errors.gym) setErrors({ ...errors, gym: null });
              }}
              className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.gym ? 'border-red-500' : 'border-gray-700'
              }`}
              placeholder="Enter gym or location..."
            />
            {errors.gym && <p className="text-red-400 text-xs mt-1">{errors.gym}</p>}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Grade *
            </label>
            <select 
              value={grade} 
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {GRADES.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Type *
            </label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Date *
          </label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => {
              setDate(e.target.value);
              if (errors.date) setErrors({ ...errors, date: null });
            }}
            className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
              errors.date ? 'border-red-500' : 'border-gray-700'
            }`}
          />
          {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={sent}
            onChange={(e) => setSent(e.target.checked)}
            className="w-5 h-5 text-green-600 bg-gray-900 border-gray-700 rounded focus:ring-green-500 focus:ring-2"
          />
          <label className="ml-3 text-sm font-medium text-gray-300">
            Successfully sent this climb
          </label>
        </div>

        {errors.submit && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm">
            {errors.submit}
          </div>
        )}
        {success && (
          <div className="bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 rounded-lg text-sm">
            ✓ Climb {isEditing ? 'updated' : 'added'} successfully!
          </div>
        )}
        <div className="flex gap-3">
          {isEditing && onCancel && (
            <button 
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-all duration-200"
            >
              Cancel
            </button>
          )}
          <button 
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={`${isEditing && onCancel ? 'flex-1' : 'w-full'} bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg flex items-center justify-center gap-2`}
          >
            {loading ? (
              <>
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {isEditing ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              isEditing ? 'Update Climb' : 'Add Climb'
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
  )
}

export default AddClimbForm
