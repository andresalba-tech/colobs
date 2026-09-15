import React from 'react';
import { Mail, Activity } from 'lucide-react';

interface HeaderProps {
  onOpenContact: () => void;
  totalJobsInDb: number;
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

export const Header: React.FC<HeaderProps> = ({ onOpenContact, totalJobsInDb }) => {
  return (
    <header style={{ marginBottom: '2.5rem' }}>
      {/* Barra superior de autor y portafolio */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Created by</span>
          <a
            href="https://www.linkedin.com/in/andrés-eduardo-alba-matallana/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontWeight: 700,
              fontSize: '0.925rem',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            Andrés Alba
            <span style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 500 }}>
              — Senior Full-Stack & AI Engineer
            </span>
          </a>
          <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>
            React · TypeScript · Node.js · LLM · RAG · Agents
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a
            href="https://www.linkedin.com/in/andrés-eduardo-alba-matallana/"
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn de Andrés Alba"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              transition: 'color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#38bdf8')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <LinkedinIcon />
            <span>LinkedIn</span>
          </a>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              transition: 'color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <GithubIcon />
            <span>GitHub</span>
          </a>

          <button
            onClick={onOpenContact}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'var(--bg-elevated)',
              color: 'var(--text-main)',
              padding: '0.4rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 500,
              border: '1px solid var(--border-highlight)',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.color = '#60a5fa';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-highlight)';
              e.currentTarget.style.color = 'var(--text-main)';
            }}
          >
            <Mail size={15} />
            <span>Contacto</span>
          </button>
        </div>
      </div>

      {/* Título Principal y Propósito del Observatorio */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <h1
              style={{
                fontSize: '2.25rem',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #94a3b8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Colombia Tech Job Market
            </h1>
            <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Activity size={12} />
              <span>En vivo</span>
            </span>
          </div>

          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-muted)',
              fontWeight: 400,
              maxWidth: '680px',
            }}
          >
            <strong style={{ color: 'var(--text-main)' }}>LinkedIn Promoted Jobs Market Intelligence</strong> — Observatorio público
            para analizar cómo evoluciona en el tiempo la demanda laboral tecnológica en Colombia a partir de vacantes promocionadas reales.
          </p>
        </div>

        {/* Contador de muestra activa */}
        <div
          className="card"
          style={{
            padding: '0.85rem 1.25rem',
            background: 'rgba(17, 24, 39, 0.7)',
            borderColor: 'var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        >
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-subtle)' }}>
            Muestra Observada
          </span>
          <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-series-0)' }}>
            {totalJobsInDb.toLocaleString()} vacantes
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Colombia (LinkedIn Job Library)</span>
        </div>
      </div>
    </header>
  );
};
