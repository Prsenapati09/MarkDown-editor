
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Close the dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape, for keyboard users
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <nav className="border-b border-ink-line bg-ink px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 group">
        <FileText size={20} className="text-gold" strokeWidth={2} />
        <span className="font-serif text-xl text-paper tracking-tight">Folio</span>
      </Link>

      {user && (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            aria-haspopup="true"
            aria-expanded={isOpen}
            aria-label="Account menu"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-ink-soft border border-ink-line text-ink-faint hover:text-paper hover:border-gold/50 transition-colors"
          >
            <User size={16} strokeWidth={2} />
          </button>

          {isOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-56 bg-ink-soft border border-ink-line rounded-lg shadow-xl shadow-black/30 overflow-hidden z-10"
            >
              <div className="px-4 py-3 border-b border-ink-line">
                <p className="font-serif text-sm text-paper truncate">{user.name}</p>
                <p className="font-mono text-xs text-ink-faint truncate mt-0.5">{user.email}</p>
              </div>
              <button
                role="menuitem"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-ink-faint hover:text-paper hover:bg-ink transition-colors"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
