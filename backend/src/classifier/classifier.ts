import { TAXONOMY_RULES, TechRule } from './taxonomy';

export interface ClassifiedResult {
  slug: string;
  name: string;
  category: string;
  matchedInTitle: boolean;
}

export function classifyJobText(title: string, description: string): ClassifiedResult[] {
  const fullText = `${title || ''}\n${description || ''}`;
  const titleText = title || '';

  const results: ClassifiedResult[] = [];

  for (const rule of TAXONOMY_RULES) {
    // Verificar si coincide con alguno de los patrones de inclusión
    const matchesPattern = rule.patterns.some((pat) => pat.test(fullText));

    if (matchesPattern) {
      // Si la regla tiene exclusiones específicas
      if (rule.excludePatterns && rule.excludePatterns.length > 0) {
        // En el caso particular de Java: si contiene 'java', verificar que no sea exclusivamente parte de 'javascript'
        if (rule.slug === 'java') {
          // Remover javascript y js del texto antes de verificar java
          const textWithoutJs = fullText.replace(/javascript|\bjs\b/gi, '');
          if (!/\bjava\b/i.test(textWithoutJs)) {
            continue;
          }
        } else {
          const isExcluded = rule.excludePatterns.some((ex) => ex.test(fullText));
          if (isExcluded) {
            continue;
          }
        }
      }

      // Detectar si aparece específicamente en el título
      const matchedInTitle = rule.patterns.some((pat) => pat.test(titleText));

      results.push({
        slug: rule.slug,
        name: rule.name,
        category: rule.category,
        matchedInTitle,
      });
    }
  }

  return results;
}
