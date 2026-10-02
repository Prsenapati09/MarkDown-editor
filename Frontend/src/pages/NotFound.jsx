import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen bg-ink flex flex-col items-center justify-center px-4 text-center">
    <p className="font-mono text-gold text-sm mb-2">404</p>
    <h1 className="font-serif text-2xl text-paper mb-2">Page not found</h1>
    <p className="font-sans text-sm text-ink-faint mb-6">
      There's nothing at this address.
    </p>
    <Link to="/" className="text-gold hover:text-gold-deep transition-colors font-sans text-sm">
      Back to your documents
    </Link>
  </div>
);

export default NotFound;
