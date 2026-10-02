
import { Heading1, Heading2, Heading3, Bold, Italic, Link2, Code, List, Quote } from 'lucide-react';

const TOOLS = [
  { id: 'h1', label: 'Heading 1', icon: Heading1, block: true, insert: '# ', placeholder: 'Heading 1' },
  { id: 'h2', label: 'Heading 2', icon: Heading2, block: true, insert: '## ', placeholder: 'Heading 2' },
  { id: 'h3', label: 'Heading 3', icon: Heading3, block: true, insert: '### ', placeholder: 'Heading 3' },
  { id: 'bold', label: 'Bold', icon: Bold, before: '**', after: '**', placeholder: 'bold text' },
  { id: 'italic', label: 'Italic', icon: Italic, before: '*', after: '*', placeholder: 'italic text' },
  { id: 'link', label: 'Link', icon: Link2, before: '[', after: '](https://example.com)', placeholder: 'link text' },
  { id: 'code', label: 'Code Block', icon: Code, fence: true, placeholder: 'code here' },
  { id: 'list', label: 'List', icon: List, block: true, insert: '- ', placeholder: 'List item' },
  { id: 'quote', label: 'Quote', icon: Quote, block: true, insert: '> ', placeholder: 'Quote' },
];

const MarkdownToolbar = ({ textareaRef, content, setContent, setIsDirty }) => {
  const insertSnippet = (item) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    let insertText, selStart, selEnd;

    if (item.fence) {
      // Fenced code block — always starts and ends on its own line so the
      // ``` markers are never glued to surrounding text
      const needsNewlineBefore = start > 0 && content[start - 1] !== '\n';
      const needsNewlineAfter = end < content.length && content[end] !== '\n';
      const prefix = (needsNewlineBefore ? '\n' : '') + '```\n';
      const suffix = '\n```' + (needsNewlineAfter ? '\n' : '');
      insertText = prefix + item.placeholder + suffix;
      selStart = start + prefix.length;
      selEnd = selStart + item.placeholder.length;
    } else if (item.block) {
      // Block-level items (headings, list, quote) start on their own line
      const needsNewlineBefore = start > 0 && content[start - 1] !== '\n';
      const prefix = (needsNewlineBefore ? '\n' : '') + item.insert;
      insertText = prefix + item.placeholder;
      selStart = start + prefix.length;
      selEnd = selStart + item.placeholder.length;
    } else {
      insertText = item.before + item.placeholder + item.after;
      selStart = start + item.before.length;
      selEnd = selStart + item.placeholder.length;
    }

    const newValue = content.slice(0, start) + insertText + content.slice(end);
    setContent(newValue);
    setIsDirty(true);

    // Select the placeholder so the user can immediately type or paste over it
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(selStart, selEnd);
    });
  };

  return (
    <div className="flex items-center gap-1 px-3 py-1.5 border-b border-ink-line bg-ink-soft/50 overflow-x-auto">
      {TOOLS.map((tool) => {
        const Icon = tool.icon;
        return (
          <button
            key={tool.id}
            type="button"
            title={tool.label}
            aria-label={tool.label}
            onClick={() => insertSnippet(tool)}
            className="flex items-center justify-center w-8 h-8 shrink-0 rounded-md text-ink-faint hover:text-paper hover:bg-ink transition-colors"
          >
            <Icon size={15} />
          </button>
        );
      })}
    </div>
  );
};

export default MarkdownToolbar;
