
import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Save, Check, Download } from 'lucide-react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import MarkdownToolbar from '../components/MarkdownToolbar';
import MarkdownCheatsheet from '../components/MarkdownCheatsheet';

const DocumentEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [error, setError] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const { data } = await api.get(`/documents/${id}`);
        setTitle(data.title);
        setContent(data.content);
      } catch (err) {
        setError('Could not load this document.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocument();
  }, [id]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setError('');
    try {
      await api.put(`/documents/${id}`, { title, content });
      setIsDirty(false);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save. Try again.');
    } finally {
      setIsSaving(false);
    }
  }, [id, title, content]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  const handleDownload = () => {
    const safeName =
      title.trim().replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, ' ').trim() || 'untitled';
    const filename = safeName.toLowerCase().endsWith('.md') ? safeName : `${safeName}.md`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <p className="font-mono text-sm text-ink-faint">loading document…</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-ink flex flex-col">
      <Navbar />

      <div className="border-b border-ink-line px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate('/dashboard')}
            aria-label="Back to documents"
            className="text-ink-faint hover:text-paper transition-colors shrink-0"
          >
            <ArrowLeft size={18} />
          </button>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setIsDirty(true);
            }}
            maxLength={150}
            className="font-serif text-lg text-paper bg-transparent border-none focus:ring-0 focus:outline-none min-w-0 truncate"
            placeholder="Untitled Document"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-ink-soft border border-ink-line hover:border-gold/50 text-paper font-sans font-semibold text-sm rounded-md px-4 py-2 transition-colors shrink-0"
          >
            <Download size={15} /> Download
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-gold hover:bg-gold-deep disabled:opacity-60 text-ink font-sans font-semibold text-sm rounded-md px-4 py-2 transition-colors shrink-0"
          >
            {justSaved ? (
              <>
                <Check size={15} /> Saved
              </>
            ) : (
              <>
                <Save size={15} /> {isSaving ? 'Saving…' : 'Save'}
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="px-6 py-2 bg-ember/10 border-b border-ember/30 text-ember text-sm font-sans">
          {error}
        </div>
      )}

      <div className="flex-1 grid md:grid-cols-2 min-h-0">
        <div className="flex flex-col min-h-0 border-r border-ink-line">
          <div className="px-4 py-2 border-b border-ink-line flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">
              Markdown
            </span>
            <MarkdownCheatsheet />
          </div>

          <MarkdownToolbar
            textareaRef={textareaRef}
            content={content}
            setContent={setContent}
            setIsDirty={setIsDirty}
          />

          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setIsDirty(true);
            }}
            spellCheck={false}
            className="flex-1 w-full bg-ink text-paper font-mono text-sm leading-6 p-4 resize-none border-none focus:ring-0 focus:outline-none placeholder:text-ink-faint"
            placeholder={'# Start writing\n\nUse **markdown** to format your text.\n\n- Lists\n- [Links](https://example.com)\n- `code`'}
          />
        </div>

        <div className="flex flex-col min-h-0 bg-paper">
          <div className="px-4 py-2 border-b border-paper-line">
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink/50">
              Preview
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {content.trim() ? (
              <div className="prose-folio max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              </div>
            ) : (
              <p className="font-serif text-ink/40 italic">Your preview will appear here.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;
