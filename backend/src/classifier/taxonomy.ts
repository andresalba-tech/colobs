export interface TechRule {
  slug: string;
  name: string;
  category: 'language' | 'frontend' | 'backend' | 'ai' | 'role';
  patterns: RegExp[];
  excludePatterns?: RegExp[];
}

export const TAXONOMY_RULES: TechRule[] = [
  // Lenguajes
  {
    slug: 'javascript',
    name: 'JavaScript',
    category: 'language',
    patterns: [/\bjavascript\b/i, /\bjs\b/i, /\bes6\b/i, /\becmascript\b/i],
  },
  {
    slug: 'typescript',
    name: 'TypeScript',
    category: 'language',
    patterns: [/\btypescript\b/i, /\bts\b/i],
  },
  {
    slug: 'python',
    name: 'Python',
    category: 'language',
    patterns: [/\bpython\b/i, /\bpython3\b/i],
  },
  {
    slug: 'java',
    name: 'Java',
    category: 'language',
    patterns: [/\bjava\b/i],
    excludePatterns: [/\bjavascript\b/i, /\bjs\b/i],
  },
  {
    slug: 'csharp',
    name: 'C#',
    category: 'language',
    patterns: [/\bc#\b/i, /\bcsharp\b/i, /\bc-sharp\b/i],
  },
  {
    slug: 'go',
    name: 'Go',
    category: 'language',
    patterns: [/\bgolang\b/i, /\bgo\s+language\b/i],
  },
  {
    slug: 'rust',
    name: 'Rust',
    category: 'language',
    patterns: [/\brust\b/i],
  },

  // Frontend
  {
    slug: 'react',
    name: 'React',
    category: 'frontend',
    patterns: [/\breact\b/i, /\breact\.js\b/i, /\breactjs\b/i, /\breact\s+native\b/i],
    excludePatterns: [/\breactive\b/i, /\breaction\b/i],
  },
  {
    slug: 'nextjs',
    name: 'Next.js',
    category: 'frontend',
    patterns: [/\bnext\.js\b/i, /\bnextjs\b/i, /\bnext\s+js\b/i],
  },
  {
    slug: 'angular',
    name: 'Angular',
    category: 'frontend',
    patterns: [/\bangular\b/i, /\bangularjs\b/i, /\bangular\.js\b/i],
  },
  {
    slug: 'vue',
    name: 'Vue',
    category: 'frontend',
    patterns: [/\bvue\b/i, /\bvue\.js\b/i, /\bvuejs\b/i],
  },

  // Backend
  {
    slug: 'nodejs',
    name: 'Node.js',
    category: 'backend',
    patterns: [/\bnode\.js\b/i, /\bnodejs\b/i, /\bnode\s+js\b/i, /\bnode\b/i],
  },
  {
    slug: 'fastapi',
    name: 'FastAPI',
    category: 'backend',
    patterns: [/\bfastapi\b/i, /\bfast-api\b/i],
  },
  {
    slug: 'django',
    name: 'Django',
    category: 'backend',
    patterns: [/\bdjango\b/i],
  },
  {
    slug: 'spring',
    name: 'Spring',
    category: 'backend',
    patterns: [/\bspring\s*boot\b/i, /\bspring\s*framework\b/i, /\bjava\s*spring\b/i, /\bspring\b/i],
  },
  {
    slug: 'dotnet',
    name: '.NET',
    category: 'backend',
    patterns: [/\b\.net\b/i, /\bdotnet\b/i, /\basp\.net\b/i],
  },

  // Inteligencia Artificial / AI Engineering
  {
    slug: 'ai-engineer',
    name: 'AI Engineer',
    category: 'ai',
    patterns: [
      /\bai\s+engineer\b/i,
      /\bml\s+engineer\b/i,
      /\bmachine\s+learning\s+engineer\b/i,
      /\bingeniero\s+de\s+ia\b/i,
      /\bapplied\s+ai\b/i,
    ],
  },
  {
    slug: 'generative-ai',
    name: 'Generative AI',
    category: 'ai',
    patterns: [/\bgenerative\s+ai\b/i, /\bgen\s*ai\b/i, /\bgenai\b/i, /\bia\s+generativa\b/i],
  },
  {
    slug: 'llm',
    name: 'LLM',
    category: 'ai',
    patterns: [/\bllm\b/i, /\bllms\b/i, /\blarge\s+language\s+model\b/i],
  },
  {
    slug: 'rag',
    name: 'RAG',
    category: 'ai',
    patterns: [/\brag\b/i, /\bretrieval[- ]augmented\s+generation\b/i],
  },
  {
    slug: 'agents',
    name: 'Agents',
    category: 'ai',
    patterns: [
      /\bagentic\b/i,
      /\bai\s+agents?\b/i,
      /\bagentes\s+de\s+ia\b/i,
      /\bautonomous\s+agents?\b/i,
      /\bmulti[- ]agent\b/i,
    ],
  },
  {
    slug: 'langchain',
    name: 'LangChain',
    category: 'ai',
    patterns: [/\blangchain\b/i, /\blanggraph\b/i, /\bllamaindex\b/i],
  },

  // Roles
  {
    slug: 'frontend-role',
    name: 'Frontend',
    category: 'role',
    patterns: [/\bfront[- ]?end\b/i, /\bfrontend\b/i],
  },
  {
    slug: 'backend-role',
    name: 'Backend',
    category: 'role',
    patterns: [/\bback[- ]?end\b/i, /\bbackend\b/i],
  },
  {
    slug: 'full-stack-role',
    name: 'Full Stack',
    category: 'role',
    patterns: [/\bfull[- ]?stack\b/i, /\bfullstack\b/i],
  },
  {
    slug: 'software-engineer-role',
    name: 'Software Engineer',
    category: 'role',
    patterns: [
      /\bsoftware\s+engineer\b/i,
      /\bdesarrollador\b/i,
      /\bsoftware\s+developer\b/i,
      /\bingeniero\s+de\s+software\b/i,
    ],
  },
];
