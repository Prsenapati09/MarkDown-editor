import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(name, email, password);
      navigate('/login');
    } catch (err) {
      const apiError = err.response?.data;
      setError(apiError?.errors?.[0]?.msg || apiError?.message || 'Something went wrong. Try again.');
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
          <h1 className="font-serif text-xl text-paper mb-1">Create your account</h1>
          <p className="font-sans text-sm text-ink-faint mb-6">Start writing in under a minute.</p>

          {error && (
            <div className="mb-4 px-3 py-2 rounded-md bg-ember/10 border border-ember/30 text-ember text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block font-sans text-xs text-ink-faint mb-1.5">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                maxLength={50}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-ink border border-ink-line rounded-md px-3 py-2 text-paper font-sans text-sm placeholder:text-ink-faint focus:border-gold transition-colors"
                placeholder="Ada Lovelace"
              />
            </div>
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
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-ink border border-ink-line rounded-md px-3 py-2 text-paper font-sans text-sm placeholder:text-ink-faint focus:border-gold transition-colors"
                placeholder="At least 8 characters, one number"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gold hover:bg-gold-deep disabled:opacity-50 text-ink font-sans font-semibold text-sm rounded-md py-2.5 transition-colors"
            >
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center font-sans text-sm text-ink-faint mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-gold hover:text-gold-deep transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
