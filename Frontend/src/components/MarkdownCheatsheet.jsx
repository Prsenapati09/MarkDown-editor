import { useState, useRef, useEffect } from 'react';
import { BookOpen, Copy, Check } from 'lucide-react';

const ENTRIES = [
  { syntax: '# Heading 1', desc: 'Largest heading' },
  { syntax: '## Heading 2', desc: 'Section heading' },
  { syntax: '### Heading 3', desc: 'Subsection heading' },
  { syntax: '**bold text**', desc: 'Bold' },
  { syntax: '*italic text*', desc: 'Italic' },
  { syntax: '[link text](https://example.com)', desc: 'Hyperlink' },
  { syntax: '`code`', desc: 'Inline code' },
  { syntax: '- List item', desc: 'Bullet list' },
  { syntax: '> Quote', desc: 'Blockquote' },
];

const MarkdownCheatsheet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = async (syntax, index) => {
    try {
      await navigator.clipboard.writeText(syntax);
      setCopiedId(index);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // Clipboard API can fail on insecure contexts — fail silently, button just won't confirm
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 text-xs font-mono text-ink-faint hover:text-paper transition-colors px-2 py-1 rounded-md hover:bg-ink"
      >
        <BookOpen size={13} />
        Cheatsheet
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-ink-soft border border-ink-line rounded-lg shadow-xl shadow-black/30 z-20 max-h-80 overflow-y-auto">
          <div className="px-3 py-2 border-b border-ink-line">
            <p className="font-sans text-xs font-semibold text-paper">Markdown syntax</p>
          </div>
          <ul>
            {ENTRIES.map((entry, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-2 px-3 py-2 border-b border-ink-line last:border-b-0 hover:bg-ink transition-colors"
              >
                <div className="min-w-0">
                  <code className="block font-mono text-xs text-gold truncate">{entry.syntax}</code>
                  <span className="block font-sans text-[11px] text-ink-faint mt-0.5">{entry.desc}</span>
                </div>
                <button
                  type="button"
                  aria-label={`Copy ${entry.desc} syntax`}
                  onClick={() => handleCopy(entry.syntax, i)}
                  className="shrink-0 p-1.5 text-ink-faint hover:text-paper transition-colors"
                >
                  {copiedId === i ? <Check size={13} className="text-moss" /> : <Copy size={13} />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MarkdownCheatsheet;