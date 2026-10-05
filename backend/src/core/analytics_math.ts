export interface DateInterval {
  labelDate: string;
  startDate: string;
  endDate: string;
}

/**
 * Parsea y normaliza la lista de slugs de tecnologías (ej. "react,python,java" -> ["react", "python", "java"])
 */
export function parseSeriesSlugs(param: string | null | undefined, max: number = 3): string[] {
  const raw = param || 'react,python,java';
  return raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, max);
}

/**
 * Calcula la ventana de intervalos temporales con granularidad adaptativa
 * (7 y 30 días: paso de 1 día; 90 días: paso de 2 días; 180+ días: paso de 5 días)
 */
export function calculateDateIntervals(maxDateStr: string | null | undefined, days: number = 30): DateInterval[] {
  const effectiveMaxStr = maxDateStr || new Date().toISOString().slice(0, 10);
  const maxDate = new Date(`${effectiveMaxStr}T00:00:00Z`);

  const stepDays = days > 180 ? 5 : days > 90 ? 2 : 1;
  const intervals: DateInterval[] = [];

  for (let i = days; i >= 0; i -= stepDays) {
    const endOffset = i;
    const startOffset = Math.min(days, i + stepDays - 1);

    const dEnd = new Date(maxDate.getTime() - endOffset * 24 * 60 * 60 * 1000);
    const dStart = new Date(maxDate.getTime() - startOffset * 24 * 60 * 60 * 1000);

    const endDateStr = dEnd.toISOString().slice(0, 10);
    const startDateStr = dStart.toISOString().slice(0, 10);

    intervals.push({
      labelDate: endDateStr,
      startDate: startDateStr,
      endDate: endDateStr,
    });
  }

  return intervals;
}

/**
 * Calcula la variación porcentual entre el período actual y el período inmediatamente anterior
 */
export function calculatePercentageChange(currentPeriodNew: number, previousPeriodNew: number): number {
  if (previousPeriodNew > 0) {
    return Math.round(((currentPeriodNew - previousPeriodNew) / previousPeriodNew) * 1000) / 10;
  }
  if (currentPeriodNew > 0) {
    return 100.0;
  }
  return 0;
}
