import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, redirectTo = 'login' }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    // Lazy but whatever
    return null;
  }

  return children;
}
