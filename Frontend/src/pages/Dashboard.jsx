import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText } from 'lucide-react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import DocumentCard from '../components/DocumentCard';

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const { data } = await api.get('/documents');
        setDocuments(data);
      } catch (err) {
        console.error('Failed to load documents', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const { data } = await api.post('/documents', {
        title: 'Untitled Document',
        content: '',
      });
      navigate(`/documents/${data._id}`);
    } catch (err) {
      console.error('Failed to create document', err);
      setIsCreating(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/documents/${id}`);
      setDocuments((prev) => prev.filter((doc) => doc._id !== id));
    } catch (err) {
      console.error('Failed to delete document', err);
    }
  };

  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-2xl text-paper">Your documents</h1>
            <p className="font-sans text-sm text-ink-faint mt-1">
              {documents.length} {documents.length === 1 ? 'document' : 'documents'}
            </p>
          </div>
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="flex items-center gap-2 bg-gold hover:bg-gold-deep disabled:opacity-50 text-ink font-sans font-semibold text-sm rounded-md px-4 py-2.5 transition-colors"
          >
            <Plus size={16} strokeWidth={2.5} />
            New document
          </button>
        </div>

        {isLoading ? (
          <p className="font-mono text-sm text-ink-faint">loading…</p>
        ) : documents.length === 0 ? (
          <div className="border border-dashed border-ink-line rounded-lg py-16 flex flex-col items-center text-center">
            <FileText size={28} className="text-ink-faint mb-3" />
            <p className="font-serif text-paper mb-1">Nothing here yet</p>
            <p className="font-sans text-sm text-ink-faint mb-5">
              Create your first document to start writing.
            </p>
            <button
              onClick={handleCreate}
              className="text-sm font-sans font-semibold text-gold hover:text-gold-deep transition-colors"
            >
              + New document
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <DocumentCard key={doc._id} document={doc} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
