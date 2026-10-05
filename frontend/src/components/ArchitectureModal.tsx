import React, { useEffect, useState } from 'react';
import { X, Server, Database, Cpu, Zap, GitBranch, Layers, ShieldCheck, ExternalLink } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'decisions'>('pipeline');

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '850px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#0f172a',
          border: '1px solid #334155',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          padding: '1.75rem',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            color: 'var(--text-muted)',
            background: 'rgba(255, 255, 255, 0.05)',
            border: 'none',
            borderRadius: '6px',
            padding: '0.4rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = '#fff')}
          onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <X size={18} />
        </button>

        {/* Header del Modal */}
        <div style={{ marginBottom: '1.5rem', paddingRight: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-series-0)',
              }}
            >
              <Cpu size={16} />
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              System Architecture & Data Pipeline
            </h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0.25rem 0 0.75rem 0' }}>
            Diseño de sistemas de extremo a extremo: ingestión desatendida, clasificación semántica, Edge Database y API desacoplada bajo principios SOLID.
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>Cloudflare D1 (Edge SQL)</span>
            <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>GitHub Actions Ingestion</span>
            <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>SOLID Layered Architecture</span>
            <span className="badge" style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
              Deterministic NLP
            </span>
          </div>
        </div>

        {/* Selector de Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            borderBottom: '1px solid var(--border-color)',
            marginBottom: '1.5rem',
            paddingBottom: '0.5rem',
          }}
        >
          <button
            onClick={() => setActiveTab('pipeline')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '6px',
              fontSize: '0.825rem',
              fontWeight: 600,
              background: activeTab === 'pipeline' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'pipeline' ? '#fff' : 'var(--text-muted)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            Pipeline de Datos (Flujo E2E)
          </button>
          <button
            onClick={() => setActiveTab('decisions')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '6px',
              fontSize: '0.825rem',
              fontWeight: 600,
              background: activeTab === 'decisions' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'decisions' ? '#fff' : 'var(--text-muted)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            Decisiones de Ingeniería (Trade-offs)
          </button>
        </div>

        {/* Contenido de Tab: Pipeline */}
        {activeTab === 'pipeline' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Paso 1 */}
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                background: 'rgba(30, 41, 59, 0.6)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <GitBranch size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: 'var(--text-main)' }}>
                  1. Ingestión Automática Diaria (Data Ingestion)
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                  Un workflow de <strong>GitHub Actions</strong> se dispara periódicamente para consultar la biblioteca de empleos promocionados de LinkedIn a través de Maton Gateway. Implementa paginación automática, control de concurrencia y reintentos exponenciales con manejo de cuotas.
                </p>
              </div>
            </div>

            {/* Paso 2 */}
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                background: 'rgba(30, 41, 59, 0.6)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(168, 85, 247, 0.15)',
                  color: '#a855f7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Zap size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: 'var(--text-main)' }}>
                  2. Motor de Clasificación Semántica (Deterministic NLP)
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                  Analiza el título y la descripción completa de cada vacante contra un catálogo de taxonomías tecnológicas. Emplea expresiones regulares con <em>negative lookaheads</em> y desambiguación contextual (ej. aislar <code>Java</code> de <code>JavaScript</code> o <code>React</code> de <code>Reactive</code>), indexando relaciones muchos a muchos (M:N).
                </p>
              </div>
            </div>

            {/* Paso 3 */}
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                background: 'rgba(30, 41, 59, 0.6)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Database size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: 'var(--text-main)' }}>
                  3. Persistencia Edge con Cloudflare D1 + SQLite
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                  Las ofertas son normalizadas y almacenadas mediante operaciones idempotentes (<code>ON CONFLICT DO UPDATE</code>). En producción, la base de datos corre sobre <strong>Cloudflare D1</strong> (SQLite distribuido en 300+ ubicaciones Edge de Cloudflare), garantizando consultas analíticas en menos de 50 ms a nivel global sin servidores dedicados.
                </p>
              </div>
            </div>

            {/* Paso 4 */}
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                background: 'rgba(30, 41, 59, 0.6)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: '#f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Server size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: 'var(--text-main)' }}>
                  4. API Desacoplada (Principios SOLID & Inversión de Dependencias)
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                  Arquitectura limpia en tres capas: Controladores HTTP modulares, Servicios de Dominio que calculan agregaciones y deltas temporales, e interfaces de Repositorios (<code>IAnalyticsRepository</code>, <code>IJobsRepository</code>) que permiten alternar SQLite y D1 sin modificar lógica de negocio.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Contenido de Tab: Decisiones de Ingeniería */}
        {activeTab === 'decisions' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.6)',
                padding: '1.15rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <ShieldCheck size={16} color="#38bdf8" />
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                  ¿Por qué D1 Edge en vez de PostgreSQL RDS?
                </h4>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                Para una carga con 98% lecturas y 2% escrituras masivas diarias en batch, una base de datos serverless en el Edge elimina costos fijos de instancias encendidas 24/7 y ofrece latencia sub-50ms mediante caché de red global.
              </p>
            </div>

            <div
              style={{
                background: 'rgba(30, 41, 59, 0.6)',
                padding: '1.15rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Layers size={16} color="#a855f7" />
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                  ¿Por qué NLP Determinista vs. LLM en Ingestión?
                </h4>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                Clasificar 2,300+ vacantes completas con llamadas a LLMs tardaría varios minutos y costaría dinero recurrente. El clasificador determinista ejecuta la misma tarea en menos de 10 segundos, con cero alucinaciones y costo $0.
              </p>
            </div>

            <div
              style={{
                background: 'rgba(30, 41, 59, 0.6)',
                padding: '1.15rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Server size={16} color="#10b981" />
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                  Idempotencia y Manejo de Concurrencia
                </h4>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                Las vacantes usan IDs externos únicos con <code>ON CONFLICT DO UPDATE</code>, actualizando la fecha <code>last_seen_at</code>. Esto permite calcular con precisión qué vacantes siguen activas frente a cuáles son nuevas publicaciones.
              </p>
            </div>

            <div
              style={{
                background: 'rgba(30, 41, 59, 0.6)',
                padding: '1.15rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Cpu size={16} color="#f59e0b" />
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                  Arquitectura Limpia & SOLID
                </h4>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                Desacoplamiento total entre transporte (HTTP), dominio (servicios analíticos) e infraestructura (SQLite/D1). Los tests automatizados corren contra repositorios fakes en milisegundos sin depender de red externa.
              </p>
            </div>
          </div>
        )}

        {/* Footer del Modal */}
        <div
          style={{
            marginTop: '1.75rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <a
            href="https://github.com/andresalba-tech"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '0.825rem',
              color: 'var(--color-series-0)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontWeight: 500,
            }}
          >
            <span>Ver código fuente del proyecto</span>
            <ExternalLink size={13} />
          </a>

          <button
            onClick={onClose}
            style={{
              padding: '0.45rem 1.15rem',
              background: 'var(--bg-elevated)',
              color: 'var(--text-main)',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
