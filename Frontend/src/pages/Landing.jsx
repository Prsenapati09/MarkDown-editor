import { Link } from 'react-router-dom';
import { FileText, ShieldCheck, Link2, ListTree, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DEMO_MARKDOWN = `# The quarterly letter

Every month we write **one honest page** for the team —
no slides, no filler.

## What shipped
- Rate-limited auth, ship-ready
- A preview pane that finally looks like a page
- [Read the full changelog](https://example.com)

> Plain text in, typeset prose out.`;

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-ink">
      {/* Nav */}
      <header className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <FileText size={20} className="text-gold" strokeWidth={2} />
          <span className="font-serif text-xl text-paper tracking-tight">Folio</span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <Link
              to="/dashboard"
              className="text-sm font-sans font-semibold bg-gold hover:bg-gold-deep text-ink rounded-md px-4 py-2 transition-colors"
            >
              Go to your documents
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-sans text-ink-faint hover:text-paper transition-colors px-3 py-2"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="text-sm font-sans font-semibold bg-gold hover:bg-gold-deep text-ink rounded-md px-4 py-2 transition-colors"
              >
                Start writing
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-gold mb-4">
            Markdown, written properly
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-paper leading-[1.1] mb-6">
            Plain text in.
            <br />
            Typeset prose out.
          </h1>
          <p className="font-sans text-ink-faint text-lg leading-relaxed mb-8 max-w-md">
            Folio is a markdown editor with a real preview — headings, links, and lists
            rendered the moment you write them. Your documents, secured and yours alone.
          </p>
          <p className="font-sans text-ink-faint mb-5">Free to use. Takes under a minute.</p>

          <div className="flex items-center gap-4">
            <Link
              to={user ? '/dashboard' : '/register'}
              className="flex items-center gap-2 bg-gold hover:bg-gold-deep text-ink font-sans font-semibold text-sm rounded-md px-5 py-3 transition-colors"
            >
              {user ? 'Go to your documents' : 'Create your first document'}
              <ArrowRight size={16} />
            </Link>
            {!user && (
              <Link
                to="/login"
                className="text-sm font-sans text-ink-faint hover:text-paper transition-colors"
              >
                I already have an account
              </Link>
            )}
          </div>
        </div>

        {/* Live-style demo of the editor/preview split — the product's actual thesis */}
        <div className="rounded-lg border border-ink-line overflow-hidden shadow-2xl shadow-black/40">
          <div className="grid sm:grid-cols-2">
            <div className="bg-ink p-5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                Markdown
              </span>
              <pre className="font-mono text-[13px] text-paper/90 leading-6 mt-3 whitespace-pre-wrap">
                {DEMO_MARKDOWN}
              </pre>
            </div>
            <div className="bg-paper p-5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink/50">
                Preview
              </span>
              <div className="mt-3">
                <h1 className="font-serif font-semibold text-ink text-xl border-b border-paper-line pb-2 mb-3">
                  The quarterly letter
                </h1>
                <p className="font-serif text-ink/90 text-sm leading-6 mb-3">
                  Every month we write <strong>one honest page</strong> for the team — no
                  slides, no filler.
                </p>
                <h2 className="font-serif font-semibold text-ink text-base mb-2">
                  What shipped
                </h2>
                <ul className="list-disc list-outside pl-5 font-serif text-ink/90 text-sm space-y-1 mb-3">
                  <li>Rate-limited auth, ship-ready</li>
                  <li>A preview pane that finally looks like a page</li>
                  <li>
                    <span className="text-gold-deep underline underline-offset-2">
                      Read the full changelog
                    </span>
                  </li>
                </ul>
                <blockquote className="border-l-2 border-gold pl-3 italic text-ink/70 text-sm">
                  Plain text in, typeset prose out.
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-ink-line">
        <div className="max-w-6xl mx-auto px-6 py-16 grid sm:grid-cols-3 gap-10">
          <div>
            <ListTree size={20} className="text-gold mb-3" />
            <h3 className="font-serif text-paper text-lg mb-2">Full markdown, live</h3>
            <p className="font-sans text-sm text-ink-faint leading-relaxed">
              Headings, lists, tables, and code blocks render as you type — the preview
              is never more than a keystroke behind.
            </p>
          </div>
          <div>
            <Link2 size={20} className="text-gold mb-3" />
            <h3 className="font-serif text-paper text-lg mb-2">Links that stay links</h3>
            <p className="font-sans text-sm text-ink-faint leading-relaxed">
              Drop in a URL and it renders as a proper hyperlink in the typeset view,
              styled and clickable, not just underlined text.
            </p>
          </div>
          <div>
            <ShieldCheck size={20} className="text-gold mb-3" />
            <h3 className="font-serif text-paper text-lg mb-2">Yours, and only yours</h3>
            <p className="font-sans text-sm text-ink-faint leading-relaxed">
              Every document is scoped to your account behind authenticated, rate-limited
              access — no one else can read or touch it.
            </p>
          </div>
        </div>
      </section>

      {/* How it works — a real sequence, so numbering earns its place here */}
      <section className="border-t border-ink-line">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="font-serif text-2xl text-paper mb-10">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-10">
            {[
              { n: '01', title: 'Write', body: 'Open a new document and write in plain markdown — no toolbar hunting.' },
              { n: '02', title: 'Preview', body: 'Watch it typeset in real time in the pane beside it.' },
              { n: '03', title: 'Save', body: 'Save when it\u2019s ready. Come back to it any time, from any device.' },
            ].map((step) => (
              <div key={step.n}>
                <span className="font-mono text-sm text-gold">{step.n}</span>
                <h3 className="font-serif text-paper text-lg mt-2 mb-1">{step.title}</h3>
                <p className="font-sans text-sm text-ink-faint leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Landing;
