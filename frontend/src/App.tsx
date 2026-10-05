import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { MarketChart } from './components/MarketChart';
import { SummaryCards } from './components/SummaryCards';
import { CreatorSection } from './components/CreatorSection';
import { ContactModal } from './components/ContactModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import { Technology, MetricType, TimelineDataPoint, SeriesSummary } from './types';

function getInitialStateFromUrl() {
  if (typeof window === 'undefined') {
    return { slugs: ['react', 'python', 'java'], metric: 'new' as MetricType, period: 30 };
  }
  const params = new URLSearchParams(window.location.search);
  const seriesParam = params.get('series');
  const metricParam = params.get('metric');
  const daysParam = params.get('days');

  const slugs = seriesParam
    ? seriesParam.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean).slice(0, 3)
    : ['react', 'python', 'java'];
  const metric: MetricType = metricParam === 'active' ? 'active' : 'new';
  const period = daysParam && [7, 30, 90, 180, 365].includes(parseInt(daysParam, 10))
    ? parseInt(daysParam, 10)
    : 30;

  return {
    slugs: slugs.length > 0 ? slugs : ['react', 'python', 'java'],
    metric,
    period,
  };
}

export function App() {
  const initial = getInitialStateFromUrl();
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(initial.slugs);
  const [selectedMetric, setSelectedMetric] = useState<MetricType>(initial.metric);
  const [selectedPeriod, setSelectedPeriod] = useState<number>(initial.period);

  const [timelineData, setTimelineData] = useState<TimelineDataPoint[]>([]);
  const [summaries, setSummaries] = useState<SeriesSummary[]>([]);
  const [totalJobs, setTotalJobs] = useState<number>(2381);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);

  // 1. Sincronizar estado en la URL (Deep-Linking para compartir)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    params.set('series', selectedSlugs.join(','));
    params.set('metric', selectedMetric);
    params.set('days', String(selectedPeriod));
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, [selectedSlugs, selectedMetric, selectedPeriod]);

  // 2. Cargar catálogo de tecnologías y conteo de vacantes al montar
  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [seriesRes, healthRes] = await Promise.all([
          fetch('/api/series'),
          fetch('/api/health'),
        ]);

        if (seriesRes.ok) {
          const sData = await seriesRes.json();
          setTechnologies(sData.series || []);
        }

        if (healthRes.ok) {
          const hData = await healthRes.json();
          setTotalJobs(hData.jobsStored || 2381);
        }
      } catch (err) {
        console.error('Error cargando catálogo inicial:', err);
      }
    }

    fetchInitialData();
  }, []);

  // 3. Cargar datos del gráfico y tarjetas cuando cambien los filtros
  useEffect(() => {
    if (selectedSlugs.length === 0) return;

    let isMounted = true;
    setIsLoading(true);

    async function fetchData() {
      try {
        const slugsParam = selectedSlugs.join(',');
        const [timelineRes, summaryRes] = await Promise.all([
          fetch(`/api/timeline?series=${slugsParam}&metric=${selectedMetric}&days=${selectedPeriod}`),
          fetch(`/api/summary?series=${slugsParam}&days=${selectedPeriod}`),
        ]);

        if (!isMounted) return;

        if (timelineRes.ok) {
          const tData = await timelineRes.json();
          setTimelineData(tData.data || []);
        }

        if (summaryRes.ok) {
          const sData = await summaryRes.json();
          setSummaries(sData.summaries || []);
        }

        // Registrar evento anónimo para analítica interna
        fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type: 'comparison_view',
            series: slugsParam,
            period: selectedPeriod,
          }),
        }).catch(() => {});
      } catch (err) {
        console.error('Error obteniendo series:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [selectedSlugs, selectedMetric, selectedPeriod]);

  // Manejo de selectores de serie
  const handleSelectSeries = (index: number, slug: string) => {
    const next = [...selectedSlugs];
    next[index] = slug;
    setSelectedSlugs(next);
  };

  const handleRemoveSeries = (index: number) => {
    if (selectedSlugs.length <= 1) return;
    const next = selectedSlugs.filter((_, i) => i !== index);
    setSelectedSlugs(next);
  };

  const handleAddSeries = () => {
    if (selectedSlugs.length >= 3) return;
    const available = technologies.find((t) => !selectedSlugs.includes(t.slug));
    const newSlug = available ? available.slug : 'ai-engineer';
    setSelectedSlugs([...selectedSlugs, newSlug]);
  };

  const handleApplyPreset = (slugs: string[]) => {
    setSelectedSlugs(slugs);
  };

  return (
    <div className="app-container">
      <Header
        onOpenContact={() => setIsContactOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        totalJobsInDb={totalJobs}
      />

      <main>
        <Controls
          technologies={technologies}
          selectedSlugs={selectedSlugs}
          onSelectSeries={handleSelectSeries}
          onRemoveSeries={handleRemoveSeries}
          onAddSeries={handleAddSeries}
          onApplyPreset={handleApplyPreset}
          selectedMetric={selectedMetric}
          onChangeMetric={setSelectedMetric}
          selectedPeriod={selectedPeriod}
          onChangePeriod={setSelectedPeriod}
        />

        <MarketChart
          data={timelineData}
          selectedSlugs={selectedSlugs}
          technologies={technologies}
          metric={selectedMetric}
          isLoading={isLoading}
        />

        <SummaryCards summaries={summaries} periodDays={selectedPeriod} />

        <CreatorSection
          onOpenContact={() => setIsContactOpen(true)}
          onOpenArchitecture={() => setIsArchitectureOpen(true)}
        />
      </main>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <ArchitectureModal isOpen={isArchitectureOpen} onClose={() => setIsArchitectureOpen(false)} />
    </div>
  );
}

export default App;
