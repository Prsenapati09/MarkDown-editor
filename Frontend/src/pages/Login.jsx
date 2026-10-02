import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <FileText size={22} className="text-gold" strokeWidth={2} />
          <span className="font-serif text-2xl text-paper tracking-tight">Folio</span>
        </div>

        <div className="bg-ink-soft border border-ink-line rounded-lg p-8">
          <h1 className="font-serif text-xl text-paper mb-1">Welcome back</h1>
          <p className="font-sans text-sm text-ink-faint mb-6">Sign in to reach your documents.</p>

          {error && (
            <div className="mb-4 px-3 py-2 rounded-md bg-ember/10 border border-ember/30 text-ember text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block font-sans text-xs text-ink-faint mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-ink border border-ink-line rounded-md px-3 py-2 text-paper font-sans text-sm placeholder:text-ink-faint focus:border-gold transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block font-sans text-xs text-ink-faint mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-ink border border-ink-line rounded-md px-3 py-2 text-paper font-sans text-sm placeholder:text-ink-faint focus:border-gold transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gold hover:bg-gold-deep disabled:opacity-50 text-ink font-sans font-semibold text-sm rounded-md py-2.5 transition-colors"
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center font-sans text-sm text-ink-faint mt-6">
          New to Folio?{' '}
          <Link to="/register" className="text-gold hover:text-gold-deep transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
