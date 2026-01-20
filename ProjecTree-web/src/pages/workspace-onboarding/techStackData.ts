// 기술 스택 더미 데이터 (나중에 API로 교체 예정)

export const TECH_STACK_OPTIONS = [
  // Frontend
  'React',
  'Vue',
  'Angular',
  'Next.js',
  'Nuxt.js',
  'Svelte',
  'TypeScript',
  'JavaScript',
  'HTML',
  'CSS',
  'Tailwind CSS',
  'Bootstrap',
  'Material-UI',
  'Ant Design',
  'Chakra UI',

  // Backend
  'Node.js',
  'Express',
  'NestJS',
  'Spring Boot',
  'Django',
  'Flask',
  'FastAPI',
  'Ruby on Rails',
  'Laravel',
  'ASP.NET',

  // Database
  'MySQL',
  'PostgreSQL',
  'MongoDB',
  'Redis',
  'Oracle',
  'MariaDB',
  'SQLite',
  'Elasticsearch',

  // Mobile
  'React Native',
  'Flutter',
  'Swift',
  'Kotlin',
  'Ionic',

  // DevOps & Tools
  'Docker',
  'Kubernetes',
  'Jenkins',
  'GitHub Actions',
  'AWS',
  'Azure',
  'Google Cloud',
  'Nginx',
  'Apache',

  // Others
  'GraphQL',
  'REST API',
  'WebSocket',
  'Git',
  'Figma',
] as const;

export type TechStack = (typeof TECH_STACK_OPTIONS)[number];
