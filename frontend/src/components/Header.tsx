import React from 'react';
import { Mail, Activity, Cpu, ExternalLink } from 'lucide-react';

interface HeaderProps {
  onOpenContact: () => void;
  onOpenArchitecture: () => void;
  totalJobsInDb: number;
}

const LinkedinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export const Header: React.FC<HeaderProps> = ({ onOpenContact, onOpenArchitecture, totalJobsInDb }) => {
  return (
    <header style={{ marginBottom: '2.5rem' }}>
      {/* Top Navbar estilo SaaS/Linear */}
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
        {/* Lado Izquierdo: Branding discreto, creador y estado de pipeline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span
              style={{
                fontWeight: 800,
                fontSize: '1rem',
                letterSpacing: '-0.02em',
                color: 'var(--text-main)',
              }}
            >
              ColObs
            </span>
            <span
              style={{
                fontSize: '0.7rem',
                padding: '0.15rem 0.45rem',
                borderRadius: '4px',
                background: 'rgba(255, 255, 255, 0.06)',
                color: 'var(--text-muted)',
                fontWeight: 500,
              }}
            >
              v0.2.0
            </span>
          </div>

          <span style={{ color: 'var(--border-color)' }}>•</span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>by</span>
            <a
              href="https://www.linkedin.com/in/andrés-eduardo-alba-matallana/"
              target="_blank"
              rel="noopener noreferrer"
              title="Perfil de LinkedIn de Andrés Alba"
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                transition: 'color 0.15s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = '#38bdf8')}
              onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-main)')}
            >
              <span>Andrés Alba</span>
              <LinkedinIcon />
            </a>
          </div>

          <span style={{ color: 'var(--border-color)' }}>•</span>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.775rem',
              color: '#10b981',
              background: 'rgba(16, 185, 129, 0.08)',
              padding: '0.2rem 0.55rem',
              borderRadius: '999px',
              border: '1px solid rgba(16, 185, 129, 0.2)',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 6px #10b981',
              }}
            />
            <span>Live Pipeline (D1 Edge)</span>
          </div>
        </div>

        {/* Lado Derecho: Acciones de Ingeniería y Contacto */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Botón de Arquitectura del Sistema (Demuestra Seniority) */}
          <button
            onClick={onOpenArchitecture}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(56, 189, 248, 0.1)',
              color: '#38bdf8',
              padding: '0.4rem 0.8rem',
              borderRadius: '6px',
              fontSize: '0.825rem',
              fontWeight: 600,
              border: '1px solid rgba(56, 189, 248, 0.25)',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(56, 189, 248, 0.18)';
              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.25)';
            }}
          >
            <Cpu size={14} />
            <span>Architecture & Pipeline</span>
          </button>

          {/* Enlace al repositorio de GitHub */}
          <a
            href="https://github.com/andresalba-tech"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub de Andrés Alba"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: 'var(--text-muted)',
              fontSize: '0.825rem',
              padding: '0.4rem 0.65rem',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-elevated)',
              transition: 'all 0.15s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.borderColor = 'var(--border-highlight)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
          >
            <GithubIcon />
            <span>GitHub</span>
            <ExternalLink size={11} style={{ opacity: 0.6 }} />
          </a>

          {/* Botón de Contacto */}
          <button
            onClick={onOpenContact}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'var(--bg-elevated)',
              color: 'var(--text-main)',
              padding: '0.4rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.825rem',
              fontWeight: 500,
              border: '1px solid var(--border-highlight)',
              cursor: 'pointer',
              transition: 'all 0.15s',
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
            <Mail size={14} />
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
              Colombia Tech Job Market 🇨🇴
            </h1>
            <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Activity size={12} />
              <span>En vivo</span>
            </span>
          </div>

          <p
            style={{
              fontSize: '1.025rem',
              color: 'var(--text-muted)',
              fontWeight: 400,
              maxWidth: '680px',
              lineHeight: 1.6,
            }}
          >
            <strong style={{ color: 'var(--text-main)' }}>LinkedIn Promoted Jobs Market Intelligence</strong> — Observatorio público
            para analizar con series temporales cómo evoluciona la demanda laboral tecnológica en Colombia a partir de vacantes promocionadas reales.
          </p>
        </div>

        {/* Contador de muestra activa con metadata de observabilidad */}
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
          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-subtle)' }}>
            Muestra Observada
          </span>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-series-0)' }}>
            {totalJobsInDb.toLocaleString()} vacantes
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Colombia (LinkedIn Job Library)</span>
        </div>
      </div>
    </header>
  );
};
