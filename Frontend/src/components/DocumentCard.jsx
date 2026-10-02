import { Link } from 'react-router-dom';
import { FileText, Trash2 } from 'lucide-react';

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const DocumentCard = ({ document, onDelete }) => {
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Delete "${document.title}"? This can't be undone.`)) {
      onDelete(document._id);
    }
  };

  return (
    <Link
      to={`/documents/${document._id}`}
      className="group block bg-ink-soft border border-ink-line rounded-lg p-5 hover:border-gold/50 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <FileText size={18} className="text-gold mt-0.5 shrink-0" />
          <div className="min-w-0">
            <h3 className="font-serif text-paper text-base truncate">{document.title}</h3>
            <p className="font-mono text-xs text-ink-faint mt-1">
              Edited {formatDate(document.updatedAt)}
            </p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          aria-label={`Delete ${document.title}`}
          className="opacity-0 group-hover:opacity-100 text-ink-faint hover:text-ember transition-all shrink-0 p-1"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </Link>
  );
};

export default DocumentCard;
