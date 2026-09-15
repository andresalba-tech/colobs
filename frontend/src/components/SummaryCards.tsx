import React from 'react';
import { SeriesSummary } from '../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SummaryCardsProps {
  summaries: SeriesSummary[];
  periodDays: number;
}

const SERIES_COLORS = ['#38bdf8', '#a855f7', '#10b981'];

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summaries, periodDays }) => {
  if (summaries.length === 0) return null;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem',
      }}
    >
      {summaries.map((summary, idx) => {
        const color = SERIES_COLORS[idx] || '#38bdf8';
        const isPositive = summary.changePercent > 0;
        const isNeutral = summary.changePercent === 0;

        return (
          <div
            key={summary.slug}
            className="card"
            style={{
              borderLeft: `4px solid ${color}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '0.85rem',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: 600,
                    color: 'var(--text-subtle)',
                  }}
                >
                  {summary.category}
                </span>
                <span style={{ fontSize: '0.75rem', color: color, fontWeight: 700 }}>
                  Serie {idx + 1}
                </span>
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {summary.name}
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
              <span style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                {summary.totalActive.toLocaleString()}
              </span>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>vacantes activas</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border-color)',
                fontSize: '0.8rem',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontWeight: 600,
                  color: isPositive ? 'var(--success)' : isNeutral ? 'var(--text-subtle)' : 'var(--danger)',
                }}
              >
                {isPositive ? (
                  <TrendingUp size={15} />
                ) : isNeutral ? (
                  <Minus size={15} />
                ) : (
                  <TrendingDown size={15} />
                )}
                <span>
                  {summary.changePercent > 0 ? `+${summary.changePercent}%` : `${summary.changePercent}%`}
                </span>
              </div>

              <span style={{ color: 'var(--text-subtle)', fontSize: '0.75rem' }}>
                vs período anterior ({periodDays}d)
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
