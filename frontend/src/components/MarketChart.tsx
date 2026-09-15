import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { TimelineDataPoint, Technology, MetricType } from '../types';
import { Zap, TrendingUp } from 'lucide-react';

interface MarketChartProps {
  data: TimelineDataPoint[];
  selectedSlugs: string[];
  technologies: Technology[];
  metric: MetricType;
  isLoading: boolean;
}

const SERIES_COLORS = ['#38bdf8', '#a855f7', '#10b981'];

export const MarketChart: React.FC<MarketChartProps> = ({
  data,
  selectedSlugs,
  technologies,
  metric,
  isLoading,
}) => {
  const getTechName = (slug: string) => {
    return technologies.find((t) => t.slug === slug)?.name || slug;
  };

  // Formato de fecha legible para el eje X
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const day = parts[2];
      const monthNum = parseInt(parts[1], 10);
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      return `${day} ${months[monthNum - 1] || ''}`;
    }
    return dateStr;
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: 'rgba(17, 24, 39, 0.95)',
            border: '1px solid var(--border-highlight)',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.4rem', fontWeight: 600 }}>
            {formatDate(label)} ({label})
          </p>
          {payload.map((entry: any, index: number) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1.25rem',
                fontSize: '0.85rem',
                color: entry.color,
                margin: '0.2rem 0',
              }}
            >
              <span style={{ fontWeight: 500 }}>{getTechName(entry.dataKey)}:</span>
              <span style={{ fontWeight: 700 }}>
                {entry.value} {metric === 'new' ? 'nuevas ese día' : 'activas en el mercado'}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="card"
      style={{
        marginBottom: '1.75rem',
        padding: '1.5rem 1.5rem 1.75rem 1rem',
        position: 'relative',
        minHeight: '440px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ paddingLeft: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Evolución Temporal de la Demanda
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              Comparación visual del comportamiento del mercado tecnológico en Colombia.
            </p>
          </div>

          {/* Banner explicativo del modo activo */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: metric === 'new' ? 'rgba(56, 189, 248, 0.12)' : 'rgba(168, 85, 247, 0.12)',
              border: `1px solid ${metric === 'new' ? 'rgba(56, 189, 248, 0.25)' : 'rgba(168, 85, 247, 0.25)'}`,
              color: metric === 'new' ? '#38bdf8' : '#c084fc',
              padding: '0.4rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 500,
            }}
          >
            {metric === 'new' ? <Zap size={14} /> : <TrendingUp size={14} />}
            <span>
              {metric === 'new' ? (
                <>
                  <strong>Modo Ritmo Diario:</strong> Mide vacantes <u>nuevas</u> publicadas cada día (picos de contratación).
                </>
              ) : (
                <>
                  <strong>Modo Mercado Activo:</strong> Mide el volumen <u>acumulado</u> de vacantes abiertas vigentes (tamaño total de la demanda).
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {isLoading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(17, 24, 39, 0.6)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            borderRadius: '12px',
          }}
        >
          <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
            Actualizando series...
          </span>
        </div>
      )}

      {data.length === 0 && !isLoading ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-subtle)',
            fontSize: '0.95rem',
          }}
        >
          No hay suficientes datos temporales para las series seleccionadas en este período.
        </div>
      ) : (
        <div style={{ width: '100%', height: '340px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                {selectedSlugs.map((slug, idx) => (
                  <linearGradient key={slug} id={`color-${slug}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={SERIES_COLORS[idx]} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={SERIES_COLORS[idx]} stopOpacity={0.0} />
                  </linearGradient>
                ))}
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />

              <XAxis
                dataKey="date"
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={formatDate}
                tickLine={false}
                axisLine={{ stroke: '#1f293d' }}
              />

              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#1f293d' }}
                allowDecimals={false}
              />

              <Tooltip content={<CustomTooltip />} />

              <Legend
                formatter={(value) => (
                  <span style={{ color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 500 }}>
                    {getTechName(value)}
                  </span>
                )}
              />

              {selectedSlugs.map((slug, idx) => (
                <Area
                  key={slug}
                  type="monotone"
                  dataKey={slug}
                  name={slug}
                  stroke={SERIES_COLORS[idx]}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill={`url(#color-${slug})`}
                  dot={{ r: 3, fill: SERIES_COLORS[idx], strokeWidth: 1, stroke: '#090d16' }}
                  activeDot={{ r: 6, fill: SERIES_COLORS[idx], stroke: '#fff', strokeWidth: 2 }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
