import React, { useState } from 'react';
import { Technology, MetricType, PeriodOption } from '../types';
import { Layers, Calendar, Filter, X, Zap, Share2, Check } from 'lucide-react';

interface ControlsProps {
  technologies: Technology[];
  selectedSlugs: string[];
  onSelectSeries: (index: number, slug: string) => void;
  onRemoveSeries: (index: number) => void;
  onAddSeries: () => void;
  onApplyPreset: (slugs: string[]) => void;
  selectedMetric: MetricType;
  onChangeMetric: (metric: MetricType) => void;
  selectedPeriod: number;
  onChangePeriod: (days: number) => void;
}

const PERIOD_OPTIONS: PeriodOption[] = [
  { label: '7 días', days: 7 },
  { label: '30 días', days: 30 },
  { label: '90 días', days: 90 },
  { label: '6 meses', days: 180 },
  { label: '1 año', days: 365 },
];

import { SERIES_COLORS } from '../constants';

interface StackPreset {
  label: string;
  slugs: string[];
  tooltip: string;
}

const STACK_PRESETS: StackPreset[] = [
  { label: 'Full Stack + AI Agents', slugs: ['react', 'nodejs', 'agents'], tooltip: 'React vs Node.js vs Agents' },
  { label: 'Frontend Battle', slugs: ['react', 'angular', 'vue'], tooltip: 'React vs Angular vs Vue' },
  { label: 'Backend Heavyweights', slugs: ['python', 'java', 'dotnet'], tooltip: 'Python vs Java vs .NET' },
  { label: 'Modern Languages', slugs: ['typescript', 'go', 'rust'], tooltip: 'TypeScript vs Go vs Rust' },
  { label: 'AI Engineering Boom', slugs: ['ai-engineer', 'llm', 'langchain'], tooltip: 'AI Eng vs LLM vs LangChain' },
];

export const Controls: React.FC<ControlsProps> = ({
  technologies,
  selectedSlugs,
  onSelectSeries,
  onRemoveSeries,
  onAddSeries,
  onApplyPreset,
  selectedMetric,
  onChangeMetric,
  selectedPeriod,
  onChangePeriod,
}) => {
  const [copied, setCopied] = useState(false);

  // Agrupar tecnologías por categoría para los selects
  const categories: Record<string, { label: string; items: Technology[] }> = {
    language: { label: 'Lenguajes', items: [] },
    frontend: { label: 'Frontend', items: [] },
    backend: { label: 'Backend', items: [] },
    ai: { label: 'Inteligencia Artificial', items: [] },
    role: { label: 'Roles', items: [] },
  };

  technologies.forEach((tech) => {
    if (categories[tech.category]) {
      categories[tech.category].items.push(tech);
    }
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isPresetActive = (presetSlugs: string[]) => {
    if (presetSlugs.length !== selectedSlugs.length) return false;
    return presetSlugs.every((slug) => selectedSlugs.includes(slug));
  };

  return (
    <div
      className="card"
      style={{
        marginBottom: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}
    >
      {/* Barra de Presets Populares (UX Senior / 1-Click Comparison) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: '0.775rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontWeight: 600,
            }}
          >
            <Zap size={13} color="#f59e0b" />
            Stack Battles Rápidos:
          </span>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {STACK_PRESETS.map((preset) => {
              const active = isPresetActive(preset.slugs);
              return (
                <button
                  key={preset.label}
                  onClick={() => onApplyPreset(preset.slugs)}
                  title={preset.tooltip}
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '6px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: active ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-elevated)',
                    color: active ? '#38bdf8' : 'var(--text-muted)',
                    border: `1px solid ${active ? '#38bdf866' : 'var(--border-color)'}`,
                    transition: 'all 0.15s',
                  }}
                  onMouseOver={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.borderColor = 'var(--border-highlight)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = 'var(--text-muted)';
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                    }
                  }}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Botón de Compartir Vista / Deep-Linking */}
        <button
          onClick={handleCopyLink}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.75rem',
            padding: '0.3rem 0.65rem',
            borderRadius: '6px',
            background: copied ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            color: copied ? '#10b981' : 'var(--text-muted)',
            border: `1px solid ${copied ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-color)'}`,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          title="Copiar URL con los filtros actuales para compartir esta comparativa exacta"
        >
          {copied ? <Check size={12} /> : <Share2 size={12} />}
          <span>{copied ? '¡Enlace copiado!' : 'Compartir vista'}</span>
        </button>
      </div>

      {/* Fila: Selectores de Series (hasta 3) */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem',
          }}
        >
          <span
            style={{
              fontSize: '0.825rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Layers size={15} color="var(--primary)" />
            Comparar Series (Máximo 3 simultáneas)
          </span>

          {selectedSlugs.length < 3 && (
            <button
              onClick={onAddSeries}
              style={{
                fontSize: '0.775rem',
                color: 'var(--color-series-0)',
                background: 'rgba(56, 189, 248, 0.1)',
                padding: '0.25rem 0.6rem',
                borderRadius: '4px',
                fontWeight: 600,
                border: '1px solid rgba(56, 189, 248, 0.25)',
                cursor: 'pointer',
              }}
            >
              + Añadir serie
            </button>
          )}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
          }}
        >
          {selectedSlugs.map((slug, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'var(--bg-elevated)',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: `1px solid ${SERIES_COLORS[idx]}55`,
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: SERIES_COLORS[idx],
                  boxShadow: `0 0 8px ${SERIES_COLORS[idx]}88`,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: SERIES_COLORS[idx] }}>
                Serie {idx + 1}:
              </span>
              <select
                value={slug}
                onChange={(e) => onSelectSeries(idx, e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {Object.entries(categories).map(([catKey, cat]) => (
                  <optgroup key={catKey} label={cat.label} style={{ background: '#1e293b' }}>
                    {cat.items.map((tech) => (
                      <option key={tech.slug} value={tech.slug}>
                        {tech.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>

              {selectedSlugs.length > 1 && (
                <button
                  onClick={() => onRemoveSeries(idx)}
                  title="Eliminar serie"
                  style={{
                    color: 'var(--text-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2px',
                    borderRadius: '4px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.color = '#ef4444')}
                  onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-subtle)')}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Fila inferior: Métrica y Período */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-color)',
        }}
      >
        {/* Selector de Métrica */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <Filter size={13} />
            Métrica:
          </span>
          <div
            style={{
              display: 'inline-flex',
              background: 'var(--bg-elevated)',
              borderRadius: '8px',
              padding: '2px',
              border: '1px solid var(--border-color)',
            }}
          >
            <button
              onClick={() => onChangeMetric('new')}
              title="Muestra cuántas vacantes nuevas se publicaron ese día (ritmo de contratación)"
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                background: selectedMetric === 'new' ? 'var(--primary)' : 'transparent',
                color: selectedMetric === 'new' ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                lineHeight: 1.2,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <span>Nuevas por día</span>
              <span style={{ fontSize: '0.68rem', opacity: 0.8, fontWeight: 400 }}>
                (Ritmo / Flujo diario)
              </span>
            </button>
            <button
              onClick={() => onChangeMetric('active')}
              title="Muestra el total acumulado de vacantes abiertas vigentes (tamaño observable de la demanda)"
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                background: selectedMetric === 'active' ? 'var(--primary)' : 'transparent',
                color: selectedMetric === 'active' ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                lineHeight: 1.2,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <span>Activas acumuladas</span>
              <span style={{ fontSize: '0.68rem', opacity: 0.8, fontWeight: 400 }}>
                (Tamaño del mercado)
              </span>
            </button>
          </div>
        </div>

        {/* Selector de Período */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <Calendar size={13} />
            Período:
          </span>
          <div
            style={{
              display: 'inline-flex',
              background: 'var(--bg-elevated)',
              borderRadius: '8px',
              padding: '2px',
              border: '1px solid var(--border-color)',
            }}
          >
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.days}
                onClick={() => onChangePeriod(opt.days)}
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: selectedPeriod === opt.days ? 'var(--border-highlight)' : 'transparent',
                  color: selectedPeriod === opt.days ? '#fff' : 'var(--text-muted)',
                  transition: 'all 0.15s ease',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
