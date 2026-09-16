import { db } from '../db/database';

export interface TechNameMap {
  [slug: string]: { name: string; category: string };
}

export function getTechCatalogMap(): TechNameMap {
  const rows = db.prepare('SELECT slug, name, category FROM technologies').all() as Array<{
    slug: string;
    name: string;
    category: string;
  }>;

  const map: TechNameMap = {};
  for (const r of rows) {
    map[r.slug] = { name: r.name, category: r.category };
  }
  return map;
}

export function getVisitorAnalyticsReport() {
  const catalog = getTechCatalogMap();

  // 1. Obtener todos los eventos
  const events = db.prepare(`
    SELECT id, event_type, series_selected, period_selected, created_at
    FROM visitor_events
    ORDER BY created_at ASC
  `).all() as Array<{
    id: number;
    event_type: string;
    series_selected: string | null;
    period_selected: string | null;
    created_at: string;
  }>;

  const totalEvents = events.length;
  const firstEvent = events[0]?.created_at || null;
  const lastEvent = events[events.length - 1]?.created_at || null;

  // 2. Obtener contactos de reclutadores/empresas
  const contacts = db.prepare(`
    SELECT id, name, company, role, email, phone, country, comment, created_at
    FROM visitor_contacts
    ORDER BY created_at DESC
  `).all() as Array<any>;

  if (totalEvents === 0) {
    return {
      status: 'empty',
      message: 'Aún no se han registrado eventos de visitantes.',
      overview: { totalEvents: 0, totalContacts: contacts.length },
      topCombinations: [],
      individualTechInterest: [],
      periodPreferences: [],
      dailyTrend: [],
      recentContacts: contacts,
    };
  }

  // Estructuras para acumular estadísticas
  const comboCounts: Record<string, { count: number; slugs: string[]; periods: Record<string, number> }> = {};
  const techCounts: Record<string, number> = {};
  const coOccurrences: Record<string, Record<string, number>> = {};
  const periodCounts: Record<string, number> = {};
  const dailyCounts: Record<string, { total: number; topComboMap: Record<string, number> }> = {};

  let comparisonEventsCount = 0;

  for (const ev of events) {
    // Análisis de período
    const period = ev.period_selected ? Math.round(parseFloat(ev.period_selected)).toString() : '30';
    periodCounts[period] = (periodCounts[period] || 0) + 1;

    // Análisis de tendencia diaria
    const day = ev.created_at ? ev.created_at.slice(0, 10) : 'unknown';
    if (!dailyCounts[day]) {
      dailyCounts[day] = { total: 0, topComboMap: {} };
    }
    dailyCounts[day].total += 1;

    // Análisis de combinaciones y tecnologías
    if (ev.series_selected) {
      const rawSlugs = ev.series_selected
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);

      if (rawSlugs.length > 0) {
        comparisonEventsCount += 1;
        // Orden alfabético para normalizar (ej. "react,python" == "python,react")
        const normalizedSlugs = [...new Set(rawSlugs)].sort();
        const comboKey = normalizedSlugs.join(' + ');

        if (!comboCounts[comboKey]) {
          comboCounts[comboKey] = { count: 0, slugs: normalizedSlugs, periods: {} };
        }
        comboCounts[comboKey].count += 1;
        comboCounts[comboKey].periods[period] = (comboCounts[comboKey].periods[period] || 0) + 1;

        dailyCounts[day].topComboMap[comboKey] = (dailyCounts[day].topComboMap[comboKey] || 0) + 1;

        // Frecuencia individual y co-ocurrencias
        for (const slug of normalizedSlugs) {
          techCounts[slug] = (techCounts[slug] || 0) + 1;

          if (!coOccurrences[slug]) coOccurrences[slug] = {};
          for (const partner of normalizedSlugs) {
            if (partner !== slug) {
              coOccurrences[slug][partner] = (coOccurrences[slug][partner] || 0) + 1;
            }
          }
        }
      }
    }
  }

  // 3. Formatear Top Combinaciones
  const topCombinations = Object.entries(comboCounts)
    .map(([comboKey, data]) => {
      // Encontrar el período favorito para esta combinación
      const favoritePeriod = Object.entries(data.periods).sort((a, b) => b[1] - a[1])[0]?.[0] || '30';
      const readableNames = data.slugs.map((s) => catalog[s]?.name || s).join(' + ');

      return {
        combination: readableNames,
        slugs: data.slugs,
        searchCount: data.count,
        percentageOfQueries: Math.round((data.count / Math.max(1, comparisonEventsCount)) * 1000) / 10,
        preferredPeriodDays: parseInt(favoritePeriod, 10),
      };
    })
    .sort((a, b) => b.searchCount - a.searchCount);

  // 4. Formatear Interés Individual de Tecnologías
  const individualTechInterest = Object.entries(techCounts)
    .map(([slug, count]) => {
      const info = catalog[slug] || { name: slug, category: 'other' };

      // Top tecnologías que se buscan junto a esta
      const partners = Object.entries(coOccurrences[slug] || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([pSlug, pCount]) => ({
          tech: catalog[pSlug]?.name || pSlug,
          slug: pSlug,
          togetherCount: pCount,
        }));

      return {
        name: info.name,
        slug,
        category: info.category,
        appearancesInQueries: count,
        querySharePercent: Math.round((count / Math.max(1, comparisonEventsCount)) * 1000) / 10,
        frequentlyComparedWith: partners,
      };
    })
    .sort((a, b) => b.appearancesInQueries - a.appearancesInQueries);

  // 5. Preferencia de Períodos de tiempo
  const periodLabels: Record<string, string> = {
    '7': '7 días (Corto plazo / Flujo inmediato)',
    '30': '30 días (Mes actual / Tendencia mensual)',
    '90': '90 días (Trimestre)',
    '180': '6 meses (Semestre)',
    '365': '1 año (Largo plazo / Visión anual)',
  };

  const periodPreferences = Object.entries(periodCounts)
    .map(([p, count]) => ({
      periodDays: parseInt(p, 10),
      label: periodLabels[p] || `${p} días`,
      totalSearches: count,
      percentage: Math.round((count / totalEvents) * 1000) / 10,
    }))
    .sort((a, b) => b.totalSearches - a.totalSearches);

  // 6. Tendencia Diaria de Consultas
  const dailyTrend = Object.entries(dailyCounts)
    .map(([date, data]) => {
      const topCombo = Object.entries(data.topComboMap).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
      return {
        date,
        totalInteractions: data.total,
        mostPopularStackOnDate: topCombo,
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  // 7. Hallazgos Clave Automatizados (Insights para toma de decisiones)
  const topTechName = individualTechInterest[0]?.name || 'N/A';
  const topTechShare = individualTechInterest[0]?.querySharePercent || 0;
  const topComboName = topCombinations[0]?.combination || 'N/A';
  const topPeriodLabel = periodPreferences[0]?.label || 'N/A';

  const executiveInsights = [
    `La tecnología más buscada por los visitantes es "${topTechName}", presente en el ${topTechShare}% de todas las consultas realizadas.`,
    `La combinación exacta de stack más comparada en la plataforma es: [${topComboName}].`,
    `El horizonte temporal más consultado por los visitantes es "${topPeriodLabel}".`,
    `Se han recibido ${contacts.length} solicitudes de contacto o consultoría B2B.`,
  ];

  return {
    generatedAt: new Date().toISOString(),
    overview: {
      totalInteractionsRecorded: totalEvents,
      comparisonQueriesCount: comparisonEventsCount,
      uniqueDaysActive: dailyTrend.length,
      firstInteractionAt: firstEvent,
      lastInteractionAt: lastEvent,
      totalLeadsReceived: contacts.length,
    },
    executiveInsights,
    topCombinations,
    individualTechInterest,
    periodPreferences,
    dailyTrend,
    recentContacts: contacts.slice(0, 20),
  };
}
