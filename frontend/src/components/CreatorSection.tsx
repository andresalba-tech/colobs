import React from 'react';
import { Mail, Database } from 'lucide-react';

interface CreatorSectionProps {
  onOpenContact: () => void;
}

const LinkedinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export const CreatorSection: React.FC<CreatorSectionProps> = ({ onOpenContact }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        marginTop: '2rem',
        paddingTop: '2rem',
        borderTop: '1px solid var(--border-color)',
      }}
    >
      {/* Sección About the Creator */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-subtle)', fontWeight: 600 }}>
            About the Creator
          </span>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0.35rem 0 0.75rem 0', color: 'var(--text-main)' }}>
            Andrés Alba
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
            Senior Full-Stack & AI Engineer focused on modern web applications and applied AI systems, including LLM applications,
            RAG, agentic systems and high-impact AI-powered products.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <a
            href="https://www.linkedin.com/in/andrés-eduardo-alba-matallana/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              background: 'rgba(56, 189, 248, 0.12)',
              color: '#38bdf8',
              fontSize: '0.825rem',
              fontWeight: 600,
              border: '1px solid rgba(56, 189, 248, 0.25)',
            }}
          >
            <LinkedinIcon />
            <span>Perfil en LinkedIn</span>
          </a>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              background: 'var(--bg-elevated)',
              color: 'var(--text-main)',
              fontSize: '0.825rem',
              fontWeight: 600,
              border: '1px solid var(--border-color)',
            }}
          >
            <GithubIcon />
            <span>GitHub</span>
          </a>

          <button
            onClick={onOpenContact}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              background: 'var(--bg-elevated)',
              color: 'var(--text-main)',
              fontSize: '0.825rem',
              fontWeight: 600,
              border: '1px solid var(--border-color)',
            }}
          >
            <Mail size={15} />
            <span>Contacto</span>
          </button>
        </div>
      </div>

      {/* Metodología y Transparencia */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-subtle)', fontWeight: 600 }}>
            Metodología y Alcance
          </span>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0.35rem 0 0.75rem 0', color: 'var(--text-main)' }}>
            LinkedIn Promoted Jobs — Colombia
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '0.75rem' }}>
            El observatorio <strong>no afirma</strong> medir la totalidad absoluta de empleos en Colombia, sino una muestra
            altamente consistente y verificada: <em>las ofertas promocionadas activas en LinkedIn Job Library</em>.
          </p>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-subtle)', lineHeight: '1.5' }}>
            El propósito central es estudiar <strong>tendencias relativas y proporciones tecnológicas</strong> a lo largo del tiempo,
            permitiendo tomar decisiones profesionales basadas en datos reales y no en percepciones casuales.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-subtle)', fontSize: '0.75rem', marginTop: '1rem' }}>
          <Database size={14} />
          <span>Ingestión continua y normalización determinista con SQLite y Cloudflare D1.</span>
        </div>
      </div>
    </div>
  );
};
