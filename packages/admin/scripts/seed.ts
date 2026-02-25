/**
 * TypeORM seed — reemplaza docker/postgres/seed.sql
 * Datos reales de Carlos Andrés Beltrán Franco.
 *
 * Uso directo:  npx tsx scripts/seed.ts
 * Uso interno:  importado por scripts/migrate.ts
 */
import { DataSource } from 'typeorm';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stack(jobId: string, techs: string[]) {
  return techs.map((tech, i) => ({ jobId, tech, order: i }));
}

function sw(skillId: string, jobIds: string[]) {
  return jobIds.map((jobId, i) => ({ skillId, jobId, order: i }));
}

function pstack(projectId: string, techs: string[]) {
  return techs.map((tech, i) => ({ projectId, tech, order: i }));
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ES = 'lang-es';
const EN = 'lang-en';

// ─── Main seed ────────────────────────────────────────────────────────────────

export async function runSeed(ds: DataSource) {
  const r = (name: string) => ds.getRepository(name);

  // ── Limpieza (hijos → padres) ──────────────────────────────────────────────
  const cleanOrder = [
    'AboutCircleItem',
    'ExperienceStack',
    'ExperienceTranslation',
    'SkillWorkplace',
    'SkillTranslation',
    'SkillCategoryTranslation',
    'ProjectStack',
    'ProjectTranslation',
    'MarqueeItem',
    'SummaryCard',
    'ContactSectionTranslation',
    'FooterTranslation',
    'NavLabel',
    'MetaSeo',
    'PersonalInfo',
    'AboutSection',
    'Skill',
    'SkillCategory',
    'ExperienceJob',
    'Project',
    'ContactSubmission',
    'SocialLink',
  ];
  for (const t of cleanOrder) {
    await r(t).createQueryBuilder().delete().execute();
  }

  // ── 1. Languages ───────────────────────────────────────────────────────────
  await r('Language').save([
    { id: ES, code: 'es', name: 'Español' },
    { id: EN, code: 'en', name: 'English' },
  ]);

  // ── 2. Personal Info ───────────────────────────────────────────────────────
  await r('PersonalInfo').save([
    {
      languageId: ES,
      name: 'Carlos Andrés',
      lastName: 'Beltrán',
      role: 'Ingeniero de Sistemas & Desarrollador Senior',
      tagline:
        'Desarrollador Senior (Backend/Full\u2011Stack) con 15+ años construyendo APIs y productos web escalables. PHP (Laravel/Lumen) · JS/TS (NestJS, Angular, React) · CI/CD.',
      switchLang: 'EN',
    },
    {
      languageId: EN,
      name: 'Carlos Andrés',
      lastName: 'Beltrán',
      role: 'Systems Engineer & Senior Developer',
      tagline:
        'Senior Backend/Full\u2011Stack developer with 15+ years building scalable APIs and web products. PHP (Laravel/Lumen) · JS/TS (NestJS, Angular, React) · CI/CD.',
      switchLang: 'ES',
    },
  ]);

  // ── 3. SEO Meta ────────────────────────────────────────────────────────────
  await r('MetaSeo').save([
    {
      languageId: ES,
      title: 'Carlos Andrés Beltrán Franco | Ingeniero de Sistemas & Desarrollador Senior',
      description:
        'Hoja de vida digital de Carlos Andrés Beltrán Franco. Ingeniero de Sistemas con 15+ años en desarrollo de software: PHP (Laravel/Lumen), JS/TS (NestJS, Next.js, Angular, React), bases de datos, integraciones y CI/CD.',
    },
    {
      languageId: EN,
      title: 'Carlos Andrés Beltrán Franco | Systems Engineer & Senior Developer',
      description:
        'Digital resume of Carlos Andrés Beltrán Franco. Systems Engineer with 15+ years in software development: PHP (Laravel/Lumen), JS/TS (NestJS, Next.js, Angular, React), databases, integrations, and CI/CD.',
    },
  ]);

  // ── 4. Nav Labels ──────────────────────────────────────────────────────────
  await r('NavLabel').save([
    {
      languageId: ES,
      home: 'Inicio',
      about: 'Sobre mí',
      experience: 'Experiencia',
      skills: 'Habilidades',
      projects: 'Proyectos',
      contact: 'Contacto',
    },
    {
      languageId: EN,
      home: 'Home',
      about: 'About',
      experience: 'Experience',
      skills: 'Skills',
      projects: 'Projects',
      contact: 'Contact',
    },
  ]);

  // ── 5. About Section ──────────────────────────────────────────────────────
  await r('AboutSection').save([
    {
      id: 'about-es',
      languageId: ES,
      title: 'Sobre Mí',
      subtitle: 'Ingeniero de Sistemas',
      description:
        'Ingeniero de Sistemas y Desarrollador Senior con más de 15 años de experiencia en desarrollo de software. He participado en el diseño e implementación de APIs REST, microservicios y aplicaciones web, integrando servicios como Twilio, SendGrid y Firebase. Me enfoco en arquitectura limpia, rendimiento, pruebas automatizadas, CI/CD y trabajo ágil (Scrum).',
      location: 'Ibagué, Tolima, Colombia',
      email: 'carlosandresbeltran89@gmail.com',
      phone: '+57 320 245 2005',
    },
    {
      id: 'about-en',
      languageId: EN,
      title: 'About Me',
      subtitle: 'Systems Engineer',
      description:
        'Systems Engineer and Senior Developer with 15+ years of experience in software development. I have contributed to designing and delivering REST APIs, microservices, and web applications, integrating services such as Twilio, SendGrid, and Firebase. I focus on clean architecture, performance, automated testing, CI/CD, and agile delivery (Scrum).',
      location: 'Ibagué, Tolima, Colombia',
      email: 'carlosandresbeltran89@gmail.com',
      phone: '+57 320 245 2005',
    },
  ]);

  await r('AboutCircleItem').save([
    ...['Perfil', 'Código', 'Sistemas', 'Educación', 'Trabajo', 'Contacto'].map((label, i) => ({
      aboutSectionId: 'about-es',
      label,
      order: i,
    })),
    ...['Profile', 'Code', 'Systems', 'Education', 'Work', 'Contact'].map((label, i) => ({
      aboutSectionId: 'about-en',
      label,
      order: i,
    })),
  ]);

  // ── 6. Summary Cards ──────────────────────────────────────────────────────
  await r('SummaryCard').save([
    {
      languageId: ES,
      order: 0,
      title: 'Experiencia',
      heading: 'Experiencia',
      text: '15+ años construyendo software web de punta a punta. Enfoque fuerte en backend y APIs (Laravel/Lumen, NestJS), integración de servicios (Twilio, SendGrid, Firebase), y despliegues confiables con CI/CD.',
    },
    {
      languageId: ES,
      order: 1,
      title: 'Proyectos',
      heading: 'Proyectos',
      text: 'He participado en plataformas empresariales y productos digitales con módulos administrativos, integraciones y automatización de despliegues. Esta hoja de vida digital resume experiencia, stack y logros por rol.',
    },
    {
      languageId: ES,
      order: 2,
      title: 'Habilidades',
      heading: 'Habilidades',
      text: 'Stack principal: PHP (Laravel/Lumen/CodeIgniter), JavaScript/TypeScript (NestJS, Next.js, Angular, React) y C#/.NET. Bases de datos: MySQL, PostgreSQL y SQL Server. Buenas prácticas: pruebas automatizadas, CI/CD y trabajo ágil.',
    },
    {
      languageId: ES,
      order: 3,
      title: 'Trabajo Actual',
      heading: 'Trabajando En',
      text: 'Desarrollador Senior en INMOV - AX MARKETING (desde sep. 2018). Desarrollo de APIs y microservicios, integraciones y automatización de despliegues con Bitbucket Pipelines (reducción de tiempos de despliegue ~30%).',
    },
    {
      languageId: ES,
      order: 4,
      title: 'Sobre Mí',
      heading: 'Sobre Mí',
      text: 'Me apasiona construir soluciones simples de mantener y fáciles de escalar. Priorizo claridad, calidad y colaboración: buenas prácticas, documentación, pruebas y entrega continua.',
    },
    {
      languageId: ES,
      order: 5,
      title: 'Perfil',
      heading: 'Carlos Andrés Beltrán Franco',
      text: 'Ingeniero de Sistemas y Desarrollador Senior. Experiencia en backend, APIs, microservicios y desarrollo full\u2011stack, con enfoque en rendimiento, calidad y entrega ágil.',
    },
    {
      languageId: EN,
      order: 0,
      title: 'Experience',
      heading: 'Experience',
      text: '15+ years building end-to-end web software. Strong focus on backend and APIs (Laravel/Lumen, NestJS), third\u2011party integrations (Twilio, SendGrid, Firebase), and reliable deployments through CI/CD.',
    },
    {
      languageId: EN,
      order: 1,
      title: 'Projects',
      heading: 'Projects',
      text: 'I have contributed to business platforms and digital products including admin modules, integrations, and deployment automation. This digital resume highlights experience, stack, and outcomes per role.',
    },
    {
      languageId: EN,
      order: 2,
      title: 'Skills',
      heading: 'Skills',
      text: 'Core stack: PHP (Laravel/Lumen/CodeIgniter), JavaScript/TypeScript (NestJS, Next.js, Angular, React), and C#/.NET. Databases: MySQL, PostgreSQL, SQL Server. Practices: testing, CI/CD, and agile delivery.',
    },
    {
      languageId: EN,
      order: 3,
      title: 'Current Work',
      heading: 'Working On',
      text: 'Senior Developer at INMOV - AX MARKETING (since Sep 2018). Building APIs and microservices, integrations, and CI/CD automation with Bitbucket Pipelines (deployment time reduced by ~30%).',
    },
    {
      languageId: EN,
      order: 4,
      title: 'About Me',
      heading: 'About Me',
      text: 'I enjoy building software that is easy to maintain and scale. I value clarity, quality, and collaboration: best practices, documentation, automated testing, and continuous delivery.',
    },
    {
      languageId: EN,
      order: 5,
      title: 'Profile',
      heading: 'Carlos Andrés Beltrán Franco',
      text: 'Systems Engineer and Senior Developer. Experienced in backend, APIs, microservices, and full\u2011stack delivery, with a focus on performance, quality, and agile execution.',
    },
  ]);

  // ── 7. Marquee Items ──────────────────────────────────────────────────────
  const marqueeEs = [
    'PHP',
    'Laravel',
    'Lumen',
    'NestJS',
    'Next.js',
    'Angular',
    'React',
    'C#/.NET',
    'JavaScript',
    'TypeScript',
    'MySQL',
    'PostgreSQL',
    'SQL Server',
    'Git',
    'Bitbucket',
    'Jira',
    'Confluence',
    'Firebase',
    'Twilio',
    'SendGrid',
    'Scrum',
    'CI/CD',
    'Docker',
    'Microservicios',
    'Cypress',
    'TestRail',
    'PHPUnit',
    'Jest',
  ];
  const marqueeEn = [
    'PHP',
    'Laravel',
    'Lumen',
    'NestJS',
    'Next.js',
    'Angular',
    'React',
    'C#/.NET',
    'JavaScript',
    'TypeScript',
    'MySQL',
    'PostgreSQL',
    'SQL Server',
    'Git',
    'Bitbucket',
    'Jira',
    'Confluence',
    'Firebase',
    'Twilio',
    'SendGrid',
    'Scrum',
    'CI/CD',
    'Docker',
    'Microservices',
    'Cypress',
    'TestRail',
    'PHPUnit',
    'Jest',
  ];
  await r('MarqueeItem').save([
    ...marqueeEs.map((text, i) => ({ languageId: ES, text, order: i })),
    ...marqueeEn.map((text, i) => ({ languageId: EN, text, order: i })),
  ]);

  // ── 8. Experience Jobs ─────────────────────────────────────────────────────
  await r('ExperienceJob').save([
    {
      id: 'job-01',
      number: '01',
      company: 'INMOV - AX MARKETING',
      periodStart: 'Septiembre 2018',
      periodEnd: 'Actualidad',
      order: 0,
    },
    {
      id: 'job-02',
      number: '02',
      company: 'BLOSSOM',
      periodStart: 'Febrero 2026',
      periodEnd: 'Febrero 2026',
      order: 1,
    },
    {
      id: 'job-03',
      number: '03',
      company: 'SENA INSTITUTE',
      periodStart: '2016',
      periodEnd: '2018',
      order: 2,
    },
    {
      id: 'job-04',
      number: '04',
      company: 'IMAGINAMOS SAS',
      periodStart: 'Septiembre 2016',
      periodEnd: 'Marzo 2017',
      order: 3,
    },
    {
      id: 'job-05',
      number: '05',
      company: 'Mercadeo y Tecnología',
      periodStart: 'Mayo 2015',
      periodEnd: 'Marzo 2016',
      order: 4,
    },
    {
      id: 'job-06',
      number: '06',
      company: 'AC Webmasters',
      periodStart: 'Marzo 2013',
      periodEnd: 'Febrero 2015',
      order: 5,
    },
    {
      id: 'job-07',
      number: '07',
      company: 'Soluciones Web Colombia S.A.S.',
      periodStart: 'Julio 2012',
      periodEnd: 'Febrero 2013',
      order: 6,
    },
  ]);

  await r('ExperienceTranslation').save([
    {
      jobId: 'job-01',
      languageId: ES,
      role: 'Desarrollador Senior',
      summary:
        'Diseño y desarrollo de APIs REST y microservicios con Laravel, Lumen y NestJS. Integraciones con Twilio, SendGrid y Firebase.',
      details:
        'Automatización de despliegues con Bitbucket Pipelines (reducción ~30%). Desarrollo de aplicaciones híbridas con Cordova y Angular. Trabajo ágil (Scrum) usando Jira y Confluence.',
    },
    {
      jobId: 'job-02',
      languageId: ES,
      role: 'Desarrollador Full\u2011Stack',
      summary: 'Desarrollo en PHP para un sistema financiero integrado de Credit Unions en EE. UU.',
      details:
        'Desarrollo y mantenimiento de módulos backend y frontend, con foco en seguridad, calidad y escalabilidad.',
    },
    {
      jobId: 'job-03',
      languageId: ES,
      role: 'Instructor de Tecnología',
      summary: 'Formación en desarrollo de software: C#/ASP.NET, PHP, MySQL, jQuery y HTML5.',
      details:
        'Diseño de guías prácticas, retos y proyectos aplicados para aprendices. Acompañamiento y fortalecimiento de competencias técnicas.',
    },
    {
      jobId: 'job-04',
      languageId: ES,
      role: 'Desarrollador de Software',
      summary: 'Desarrollo de aplicaciones a medida con PHP y CodeIgniter (MVC).',
      details:
        'Integración con MySQL y Oracle. Entrega de funcionalidades por alcance en modalidad contrato por obra o labor.',
    },
    {
      jobId: 'job-05',
      languageId: ES,
      role: 'Analista y Desarrollador',
      summary: 'Desarrollo de software a medida bajo MVC CodeIgniter y PyroCMS.',
      details: 'Análisis de requerimientos, implementación y soporte evolutivo en soluciones PHP.',
    },
    {
      jobId: 'job-06',
      languageId: ES,
      role: 'Líder de Proyectos y Desarrollador',
      summary: 'Dirección y ejecución de proyectos de desarrollo web.',
      details: 'Planificación, seguimiento y desarrollo de aplicaciones con CodeIgniter (MVC).',
    },
    {
      jobId: 'job-07',
      languageId: ES,
      role: 'Analista y Desarrollador',
      summary: 'Desarrollo de aplicaciones a medida con CodeIgniter (MVC).',
      details:
        'Participación en proyectos para clientes corporativos: análisis, desarrollo y entrega.',
    },
    {
      jobId: 'job-01',
      languageId: EN,
      role: 'Senior Developer',
      summary:
        'Designed and built REST APIs and microservices with Laravel, Lumen, and NestJS. Integrations with Twilio, SendGrid, and Firebase.',
      details:
        'Implemented CI/CD with Bitbucket Pipelines (deployment time reduced by ~30%). Built hybrid apps with Cordova and Angular. Agile delivery (Scrum) with Jira and Confluence.',
    },
    {
      jobId: 'job-02',
      languageId: EN,
      role: 'Full\u2011Stack Developer',
      summary: 'PHP development for an integrated financial system for Credit Unions in the US.',
      details:
        'Built and maintained backend and frontend modules with a focus on security, quality, and scalability.',
    },
    {
      jobId: 'job-03',
      languageId: EN,
      role: 'Technology Instructor',
      summary: 'Software development training: C#/ASP.NET, PHP, MySQL, jQuery, and HTML5.',
      details:
        'Created hands\u2011on guides and applied projects. Mentored students and strengthened technical skills.',
    },
    {
      jobId: 'job-04',
      languageId: EN,
      role: 'Software Developer',
      summary: 'Custom application development using PHP and CodeIgniter (MVC).',
      details:
        'Worked with MySQL and Oracle integrations. Delivered scoped features under contract-based engagements.',
    },
    {
      jobId: 'job-05',
      languageId: EN,
      role: 'Analyst & Developer',
      summary: 'Custom software development under MVC CodeIgniter and PyroCMS.',
      details: 'Requirements analysis, implementation, and ongoing improvements for PHP solutions.',
    },
    {
      jobId: 'job-06',
      languageId: EN,
      role: 'Project Lead & Developer',
      summary: 'Led and delivered web development projects.',
      details: 'Planning, execution, and delivery of CodeIgniter (MVC) applications.',
    },
    {
      jobId: 'job-07',
      languageId: EN,
      role: 'Analyst & Developer',
      summary: 'Custom application development with CodeIgniter (MVC).',
      details: 'Contributed to corporate client projects: analysis, development, and delivery.',
    },
  ]);

  await r('ExperienceStack').save([
    ...stack('job-01', [
      'PHP',
      'Laravel',
      'Lumen',
      'NestJs',
      'Next.js',
      'React',
      'Cordova',
      'Angular',
      'Twilio',
      'SendGrid',
      'Firebase',
      'CI/CD',
      'Scrum',
    ]),
    ...stack('job-02', ['PHP', 'JavaScript', 'PostgreSQL', 'REST API', 'Git', 'Docker']),
    ...stack('job-03', [
      'C#',
      'ASP.NET',
      'PHP',
      'Laravel',
      'Blade',
      'React',
      'MySQL',
      'JQuery',
      'HTML5',
    ]),
    ...stack('job-04', ['PHP', 'CodeIgniter', 'MySQL', 'Oracle']),
    ...stack('job-05', ['PHP', 'CodeIgniter', 'PyroCMS']),
    ...stack('job-06', ['PHP', 'CodeIgniter', 'Gestión de Proyectos']),
    ...stack('job-07', ['PHP', 'CodeIgniter']),
  ]);

  // ── 9. Skill Categories ────────────────────────────────────────────────────
  await r('SkillCategory').save([
    { id: 'cat-01', order: 0 },
    { id: 'cat-02', order: 1 },
    { id: 'cat-03', order: 2 },
    { id: 'cat-04', order: 3 },
    { id: 'cat-05', order: 4 },
  ]);

  await r('SkillCategoryTranslation').save([
    { categoryId: 'cat-01', languageId: ES, name: 'Lenguajes & Frameworks' },
    { categoryId: 'cat-02', languageId: ES, name: 'Bases de Datos' },
    { categoryId: 'cat-03', languageId: ES, name: 'DevOps & Herramientas' },
    { categoryId: 'cat-04', languageId: ES, name: 'QA y Pruebas' },
    { categoryId: 'cat-05', languageId: ES, name: 'Metodologías' },
    { categoryId: 'cat-01', languageId: EN, name: 'Languages & Frameworks' },
    { categoryId: 'cat-02', languageId: EN, name: 'Databases' },
    { categoryId: 'cat-03', languageId: EN, name: 'DevOps & Tools' },
    { categoryId: 'cat-04', languageId: EN, name: 'QA & Testing' },
    { categoryId: 'cat-05', languageId: EN, name: 'Methodologies' },
  ]);

  // ── Cat 01: Languages & Frameworks ─────────────────────────────────────────
  await r('Skill').save([
    { id: 'skill-php', categoryId: 'cat-01', order: 0, years: '15+' },
    { id: 'skill-laravel', categoryId: 'cat-01', order: 1, years: '7+' },
    { id: 'skill-lumen', categoryId: 'cat-01', order: 2, years: '7+' },
    { id: 'skill-codeigniter', categoryId: 'cat-01', order: 3, years: '5+' },
    { id: 'skill-nestjs', categoryId: 'cat-01', order: 4, years: '5+' },
    { id: 'skill-nextjs', categoryId: 'cat-01', order: 5, years: '2+' },
    { id: 'skill-angular', categoryId: 'cat-01', order: 6, years: '5+' },
    { id: 'skill-react', categoryId: 'cat-01', order: 7, years: '3+' },
    { id: 'skill-javascript', categoryId: 'cat-01', order: 8, years: '15+' },
    { id: 'skill-typescript', categoryId: 'cat-01', order: 9, years: '5+' },
    { id: 'skill-csharp', categoryId: 'cat-01', order: 10, years: '2+' },
  ]);

  await r('SkillTranslation').save([
    {
      skillId: 'skill-php',
      languageId: ES,
      name: 'PHP',
      description:
        'Dominio experto con más de 15 años. Lenguaje principal para backend: APIs, servicios y aplicaciones web.',
    },
    {
      skillId: 'skill-laravel',
      languageId: ES,
      name: 'Laravel',
      description:
        'Experiencia avanzada en el framework. Usado extensivamente para desarrollo de APIs REST, microservicios y aplicaciones full-stack en INMOV - AX MARKETING.',
    },
    {
      skillId: 'skill-lumen',
      languageId: ES,
      name: 'Lumen',
      description:
        'Framework ligero de Laravel utilizado para construir microservicios y APIs de alto rendimiento.',
    },
    {
      skillId: 'skill-codeigniter',
      languageId: ES,
      name: 'CodeIgniter',
      description:
        'Framework MVC utilizado a lo largo de la carrera profesional para desarrollo de aplicaciones personalizadas.',
    },
    {
      skillId: 'skill-nestjs',
      languageId: ES,
      name: 'NestJS',
      description:
        'Framework moderno de Node.js utilizado para construir aplicaciones del lado del servidor escalables y microservicios.',
    },
    {
      skillId: 'skill-nextjs',
      languageId: ES,
      name: 'Next.js',
      description:
        'Framework React para renderizado del lado del servidor y generación de sitios estáticos.',
    },
    {
      skillId: 'skill-angular',
      languageId: ES,
      name: 'Angular',
      description:
        'Framework frontend usado para desarrollo de aplicaciones híbridas con Cordova en INMOV - AX MARKETING.',
    },
    {
      skillId: 'skill-react',
      languageId: ES,
      name: 'React',
      description:
        'Librería de UI basada en componentes para construir aplicaciones web modernas e interactivas.',
    },
    {
      skillId: 'skill-javascript',
      languageId: ES,
      name: 'JavaScript',
      description:
        'Lenguaje base para desarrollo web, usado en proyectos frontend y backend (Node.js).',
    },
    {
      skillId: 'skill-typescript',
      languageId: ES,
      name: 'TypeScript',
      description:
        'Superconjunto tipado de JavaScript usado con NestJS y Angular para código más seguro y mantenible.',
    },
    {
      skillId: 'skill-csharp',
      languageId: ES,
      name: 'C#/.NET',
      description:
        'Usado para desarrollo ASP.NET y enseñanza en SENA INSTITUTE. Desarrollo de aplicaciones empresariales.',
    },
    {
      skillId: 'skill-php',
      languageId: EN,
      name: 'PHP',
      description:
        'Expert-level proficiency with 15+ years. Primary backend language for APIs, services, and web applications.',
    },
    {
      skillId: 'skill-laravel',
      languageId: EN,
      name: 'Laravel',
      description:
        'Advanced framework expertise. Used extensively for REST API development, microservices, and full-stack applications at INMOV - AX MARKETING.',
    },
    {
      skillId: 'skill-lumen',
      languageId: EN,
      name: 'Lumen',
      description:
        'Lightweight Laravel framework used for building high-performance microservices and APIs.',
    },
    {
      skillId: 'skill-codeigniter',
      languageId: EN,
      name: 'CodeIgniter',
      description:
        'MVC framework used throughout career for custom application development across multiple companies.',
    },
    {
      skillId: 'skill-nestjs',
      languageId: EN,
      name: 'NestJS',
      description:
        'Modern Node.js framework used for building scalable server-side applications and microservices.',
    },
    {
      skillId: 'skill-nextjs',
      languageId: EN,
      name: 'Next.js',
      description: 'React framework for server-side rendering and static site generation.',
    },
    {
      skillId: 'skill-angular',
      languageId: EN,
      name: 'Angular',
      description:
        'Frontend framework used for hybrid application development with Cordova at INMOV - AX MARKETING.',
    },
    {
      skillId: 'skill-react',
      languageId: EN,
      name: 'React',
      description: 'Component-based UI library for building modern, interactive web applications.',
    },
    {
      skillId: 'skill-javascript',
      languageId: EN,
      name: 'JavaScript',
      description:
        'Core language for web development, used across frontend and backend (Node.js) projects.',
    },
    {
      skillId: 'skill-typescript',
      languageId: EN,
      name: 'TypeScript',
      description:
        'Typed superset of JavaScript used with NestJS and Angular for safer, more maintainable code.',
    },
    {
      skillId: 'skill-csharp',
      languageId: EN,
      name: 'C#/.NET',
      description:
        'Used for ASP.NET development and teaching at SENA INSTITUTE. Enterprise-grade application development.',
    },
  ]);

  await r('SkillWorkplace').save([
    ...sw('skill-php', ['job-02', 'job-01', 'job-03', 'job-04', 'job-05', 'job-06', 'job-07']),
    ...sw('skill-laravel', ['job-02', 'job-01']),
    ...sw('skill-lumen', ['job-01']),
    ...sw('skill-codeigniter', ['job-04', 'job-05', 'job-06', 'job-07']),
    ...sw('skill-nestjs', ['job-01']),
    ...sw('skill-nextjs', ['job-01']),
    ...sw('skill-angular', ['job-01']),
    ...sw('skill-react', ['job-02', 'job-01']),
    ...sw('skill-javascript', ['job-01', 'job-03', 'job-04', 'job-05', 'job-06', 'job-07']),
    ...sw('skill-typescript', ['job-01']),
    ...sw('skill-csharp', ['job-03']),
  ]);

  // ── Cat 02: Databases ─────────────────────────────────────────────────────
  await r('Skill').save([
    { id: 'skill-mysql', categoryId: 'cat-02', order: 0, years: '15+' },
    { id: 'skill-postgresql', categoryId: 'cat-02', order: 1, years: '5+' },
    { id: 'skill-sqlserver', categoryId: 'cat-02', order: 2, years: '2+' },
  ]);

  await r('SkillTranslation').save([
    {
      skillId: 'skill-mysql',
      languageId: ES,
      name: 'MySQL',
      description:
        'Base de datos relacional principal usada en la mayoría de proyectos. Experto en diseño, optimización y gestión.',
    },
    {
      skillId: 'skill-postgresql',
      languageId: ES,
      name: 'PostgreSQL',
      description:
        'Base de datos avanzada de código abierto usada para requerimientos complejos de datos y escalabilidad.',
    },
    {
      skillId: 'skill-sqlserver',
      languageId: ES,
      name: 'SQL Server',
      description: 'Plataforma de base de datos Microsoft usada en proyectos empresariales .NET.',
    },
    {
      skillId: 'skill-mysql',
      languageId: EN,
      name: 'MySQL',
      description:
        'Primary relational database used across most projects. Expert in design, optimization, and management.',
    },
    {
      skillId: 'skill-postgresql',
      languageId: EN,
      name: 'PostgreSQL',
      description:
        'Advanced open-source database used for complex data requirements and scalability.',
    },
    {
      skillId: 'skill-sqlserver',
      languageId: EN,
      name: 'SQL Server',
      description: 'Microsoft database platform used in enterprise .NET projects.',
    },
  ]);

  await r('SkillWorkplace').save([
    ...sw('skill-mysql', ['job-02', 'job-01', 'job-03', 'job-04', 'job-05', 'job-06', 'job-07']),
    ...sw('skill-postgresql', ['job-01']),
    ...sw('skill-sqlserver', ['job-03']),
  ]);

  // ── Cat 03: DevOps & Tools ────────────────────────────────────────────────
  await r('Skill').save([
    { id: 'skill-git', categoryId: 'cat-03', order: 0, years: '10+' },
    { id: 'skill-bitbucket', categoryId: 'cat-03', order: 1, years: '7+' },
    { id: 'skill-docker', categoryId: 'cat-03', order: 2, years: '5+' },
    { id: 'skill-cicd', categoryId: 'cat-03', order: 3, years: '5+' },
    { id: 'skill-firebase', categoryId: 'cat-03', order: 4, years: '5+' },
    { id: 'skill-jira', categoryId: 'cat-03', order: 5, years: '7+' },
    { id: 'skill-confluence', categoryId: 'cat-03', order: 6, years: '7+' },
  ]);

  await r('SkillTranslation').save([
    {
      skillId: 'skill-git',
      languageId: ES,
      name: 'Git',
      description:
        'Sistema de control de versiones utilizado diariamente para desarrollo colaborativo y gestión de código.',
    },
    {
      skillId: 'skill-bitbucket',
      languageId: ES,
      name: 'Bitbucket',
      description:
        'Plataforma de hosting Git con pipelines CI/CD integrados. Herramienta principal en INMOV - AX MARKETING.',
    },
    {
      skillId: 'skill-docker',
      languageId: ES,
      name: 'Docker',
      description:
        'Plataforma de contenedores para entornos de desarrollo y despliegue consistentes.',
    },
    {
      skillId: 'skill-cicd',
      languageId: ES,
      name: 'CI/CD',
      description:
        'Integración y Despliegue Continuo con Bitbucket Pipelines, reduciendo tiempos de despliegue en un 30%.',
    },
    {
      skillId: 'skill-firebase',
      languageId: ES,
      name: 'Firebase',
      description:
        'Plataforma de Google para bases de datos en tiempo real, autenticación y notificaciones push.',
    },
    {
      skillId: 'skill-jira',
      languageId: ES,
      name: 'Jira',
      description:
        'Herramienta de gestión de proyectos usada para planificación ágil de sprints y seguimiento de tareas.',
    },
    {
      skillId: 'skill-confluence',
      languageId: ES,
      name: 'Confluence',
      description: 'Plataforma de documentación usada para docs técnicos y colaboración de equipo.',
    },
    {
      skillId: 'skill-git',
      languageId: EN,
      name: 'Git',
      description:
        'Version control system used daily for collaborative development and code management.',
    },
    {
      skillId: 'skill-bitbucket',
      languageId: EN,
      name: 'Bitbucket',
      description:
        'Git hosting platform with integrated CI/CD pipelines. Primary tool at INMOV - AX MARKETING.',
    },
    {
      skillId: 'skill-docker',
      languageId: EN,
      name: 'Docker',
      description: 'Container platform for consistent development and deployment environments.',
    },
    {
      skillId: 'skill-cicd',
      languageId: EN,
      name: 'CI/CD',
      description:
        'Continuous Integration and Deployment with Bitbucket Pipelines, reducing deployment times by 30%.',
    },
    {
      skillId: 'skill-firebase',
      languageId: EN,
      name: 'Firebase',
      description:
        'Google platform for real-time databases, authentication, and push notifications.',
    },
    {
      skillId: 'skill-jira',
      languageId: EN,
      name: 'Jira',
      description: 'Project management tool used for agile sprint planning and task tracking.',
    },
    {
      skillId: 'skill-confluence',
      languageId: EN,
      name: 'Confluence',
      description: 'Documentation platform used for technical docs and team collaboration.',
    },
  ]);

  await r('SkillWorkplace').save([
    ...sw('skill-git', ['job-01', 'job-04', 'job-06']),
    ...sw('skill-bitbucket', ['job-01']),
    ...sw('skill-docker', ['job-01']),
    ...sw('skill-cicd', ['job-01']),
    ...sw('skill-firebase', ['job-01']),
    ...sw('skill-jira', ['job-01']),
    ...sw('skill-confluence', ['job-01']),
  ]);

  // ── Cat 04: QA & Testing ──────────────────────────────────────────────────
  await r('Skill').save([
    { id: 'skill-cypress', categoryId: 'cat-04', order: 0, years: '3+' },
    { id: 'skill-testrail', categoryId: 'cat-04', order: 1, years: '3+' },
    { id: 'skill-pest', categoryId: 'cat-04', order: 2, years: '3+' },
    { id: 'skill-phpunit', categoryId: 'cat-04', order: 3, years: '5+' },
    { id: 'skill-jest', categoryId: 'cat-04', order: 4, years: '3+' },
  ]);

  await r('SkillTranslation').save([
    {
      skillId: 'skill-cypress',
      languageId: ES,
      name: 'Cypress',
      description: 'Framework de pruebas de extremo a extremo (E2E) para aplicaciones web.',
    },
    {
      skillId: 'skill-testrail',
      languageId: ES,
      name: 'TestRail',
      description:
        'Plataforma de gestión de casos de prueba para organizar y dar seguimiento a esfuerzos de pruebas.',
    },
    {
      skillId: 'skill-pest',
      languageId: ES,
      name: 'Pest',
      description:
        'Framework de pruebas PHP con sintaxis elegante para pruebas unitarias y de funcionalidad.',
    },
    {
      skillId: 'skill-phpunit',
      languageId: ES,
      name: 'PHPUnit',
      description:
        'El framework estándar de pruebas PHP para pruebas unitarias. Usado para escribir pruebas automatizadas que aseguran la calidad y confiabilidad del código.',
    },
    {
      skillId: 'skill-jest',
      languageId: ES,
      name: 'Jest',
      description:
        'Framework de pruebas JavaScript para pruebas unitarias y de integración. Usado con proyectos NestJS y React.',
    },
    {
      skillId: 'skill-cypress',
      languageId: EN,
      name: 'Cypress',
      description: 'End-to-end testing framework for web applications.',
    },
    {
      skillId: 'skill-testrail',
      languageId: EN,
      name: 'TestRail',
      description: 'Test case management platform for organizing and tracking testing efforts.',
    },
    {
      skillId: 'skill-pest',
      languageId: EN,
      name: 'Pest',
      description: 'PHP testing framework with elegant syntax for unit and feature testing.',
    },
    {
      skillId: 'skill-phpunit',
      languageId: EN,
      name: 'PHPUnit',
      description:
        'The standard PHP testing framework for unit testing. Used for writing automated tests ensuring code quality and reliability.',
    },
    {
      skillId: 'skill-jest',
      languageId: EN,
      name: 'Jest',
      description:
        'JavaScript testing framework for unit and integration tests. Used with NestJS and React projects.',
    },
  ]);

  await r('SkillWorkplace').save([
    ...sw('skill-cypress', ['job-01']),
    ...sw('skill-testrail', ['job-01']),
    ...sw('skill-pest', ['job-01']),
    ...sw('skill-phpunit', ['job-01', 'job-04']),
    ...sw('skill-jest', ['job-01']),
  ]);

  // ── Cat 05: Methodologies ─────────────────────────────────────────────────
  await r('Skill').save([
    { id: 'skill-scrum', categoryId: 'cat-05', order: 0, years: '7+' },
    { id: 'skill-mvc', categoryId: 'cat-05', order: 1, years: '15+' },
    { id: 'skill-microservices', categoryId: 'cat-05', order: 2, years: '5+' },
  ]);

  await r('SkillTranslation').save([
    {
      skillId: 'skill-scrum',
      languageId: ES,
      name: 'Scrum',
      description:
        'Metodología ágil aplicada en el día a día con planificación de sprints, reuniones diarias de seguimiento y retrospectivas.',
    },
    {
      skillId: 'skill-mvc',
      languageId: ES,
      name: 'MVC',
      description:
        'Patrón de arquitectura Modelo-Vista-Controlador usado a través de frameworks PHP.',
    },
    {
      skillId: 'skill-microservices',
      languageId: ES,
      name: 'Microservicios',
      description:
        'Patrón de arquitectura distribuida para construir aplicaciones escalables y mantenibles.',
    },
    {
      skillId: 'skill-scrum',
      languageId: EN,
      name: 'Scrum',
      description:
        'Agile methodology applied daily with sprint planning, daily standups, and retrospectives.',
    },
    {
      skillId: 'skill-mvc',
      languageId: EN,
      name: 'MVC',
      description: 'Model-View-Controller architecture pattern used across PHP frameworks.',
    },
    {
      skillId: 'skill-microservices',
      languageId: EN,
      name: 'Microservices',
      description:
        'Distributed architecture pattern for building scalable, maintainable applications.',
    },
  ]);

  await r('SkillWorkplace').save([
    ...sw('skill-scrum', ['job-01']),
    ...sw('skill-mvc', ['job-01', 'job-04', 'job-05', 'job-06', 'job-07']),
    ...sw('skill-microservices', ['job-01']),
  ]);

  // ── 10. Projects ──────────────────────────────────────────────────────────
  await r('Project').save([
    { id: 'proj-01', order: 0 },
    { id: 'proj-02', order: 1 },
    { id: 'proj-03', order: 2 },
    { id: 'proj-04', order: 3 },
    { id: 'proj-05', order: 4 },
  ]);

  await r('ProjectTranslation').save([
    {
      projectId: 'proj-01',
      languageId: ES,
      title: 'INMOV Platform',
      description:
        'Plataforma empresarial con APIs REST, microservicios y aplicaciones híbridas. Integraciones con Twilio, SendGrid y Firebase.',
    },
    {
      projectId: 'proj-01',
      languageId: EN,
      title: 'INMOV Platform',
      description:
        'Enterprise platform with REST APIs, microservices and hybrid applications. Integrations with Twilio, SendGrid, and Firebase.',
    },
    {
      projectId: 'proj-02',
      languageId: ES,
      title: 'CI/CD Pipeline',
      description:
        'Pipeline de integración continua con Bitbucket, reduciendo tiempos de despliegue en un 30 %.',
    },
    {
      projectId: 'proj-02',
      languageId: EN,
      title: 'CI/CD Pipeline',
      description:
        'Continuous integration pipeline with Bitbucket, reducing deployment times by 30%.',
    },
    {
      projectId: 'proj-03',
      languageId: ES,
      title: 'Plataforma Educativa',
      description: 'Material didáctico y proyectos aplicados para formación técnica en SENA.',
    },
    {
      projectId: 'proj-03',
      languageId: EN,
      title: 'Education Platform',
      description: 'Teaching materials and applied projects for technical training at SENA.',
    },
    {
      projectId: 'proj-04',
      languageId: ES,
      title: 'Apps Híbridas',
      description: 'Desarrollo de aplicaciones móviles híbridas con Cordova y Angular.',
    },
    {
      projectId: 'proj-04',
      languageId: EN,
      title: 'Hybrid Apps',
      description: 'Hybrid mobile application development with Cordova and Angular.',
    },
    {
      projectId: 'proj-05',
      languageId: ES,
      title: 'Soluciones Corporativas',
      description: 'Aplicaciones web a medida con CodeIgniter para clientes corporativos.',
    },
    {
      projectId: 'proj-05',
      languageId: EN,
      title: 'Corporate Solutions',
      description: 'Custom web applications with CodeIgniter for corporate clients.',
    },
  ]);

  await r('ProjectStack').save([
    ...pstack('proj-01', ['Laravel', 'NestJS', 'Angular']),
    ...pstack('proj-02', ['Bitbucket', 'Docker']),
    ...pstack('proj-03', ['C#', 'PHP', 'MySQL']),
    ...pstack('proj-04', ['Cordova', 'Angular']),
    ...pstack('proj-05', ['PHP', 'CodeIgniter']),
  ]);

  // ── 11. Contact Section ───────────────────────────────────────────────────
  await r('ContactSectionTranslation').save([
    {
      languageId: ES,
      title: 'Hablemos',
      titleHighlight: 'Conectemos',
      subtitle:
        '¡Me encantaría saber de ti! Ya sea que tengas una pregunta, una idea de proyecto o simplemente quieras saludar, no dudes en contactarme.',
      formName: 'Nombre',
      formEmail: 'Correo electrónico',
      formSubject: 'Asunto',
      formMessage: 'Mensaje',
      formSend: 'Enviar',
      formSending: 'Enviando...',
      formSuccess: '¡Mensaje enviado exitosamente!',
      formError: 'Error al enviar el mensaje. Por favor intenta de nuevo.',
    },
    {
      languageId: EN,
      title: "Let's",
      titleHighlight: 'Connect',
      subtitle:
        "I'd love to hear from you! Whether you have a question, a project idea, or just want to say hello, feel free to reach out.",
      formName: 'Name',
      formEmail: 'Email',
      formSubject: 'Subject',
      formMessage: 'Message',
      formSend: 'Send',
      formSending: 'Sending...',
      formSuccess: 'Message sent successfully!',
      formError: 'Error sending message. Please try again.',
    },
  ]);

  // ── 12. Footer ────────────────────────────────────────────────────────────
  await r('FooterTranslation').save([
    {
      languageId: ES,
      name: 'Carlos Andrés Beltrán Franco',
      email: 'carlosandresbeltran89@gmail.com',
    },
    {
      languageId: EN,
      name: 'Carlos Andrés Beltrán Franco',
      email: 'carlosandresbeltran89@gmail.com',
    },
  ]);

  // ── 13. Social Links ─────────────────────────────────────────────────────
  await r('SocialLink').save([
    {
      platform: 'linkedin',
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/carlos-andrés-beltrán-franco-3b17a649',
      urlEn: null,
      icon: 'M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z',
      order: 0,
      visible: true,
    },
    {
      platform: 'github',
      label: 'GitHub',
      url: 'https://github.com/CarlosAndresBF1',
      urlEn: null,
      icon: 'M208.31,75.68A59.78,59.78,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H124A59.75,59.75,0,0,0,76,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,56,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,96,192v8H72a24,24,0,0,1-24-24A40,40,0,0,0,8,136a8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40H96v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,216,112v-8A58.14,58.14,0,0,0,208.31,75.68ZM200,112a40,40,0,0,1-40,40H112a40,40,0,0,1-40-40v-8a41.74,41.74,0,0,1,6.9-22.48A8,8,0,0,0,80,73.55a43.81,43.81,0,0,1,.79-33.58,43.88,43.88,0,0,1,32.32,20.06A8,8,0,0,0,119.82,64h32.35a8,8,0,0,0,6.74-3.69,43.87,43.87,0,0,1,32.32-20.06A43.81,43.81,0,0,1,192,73.55a8,8,0,0,0,1.1,7.69A41.72,41.72,0,0,1,200,104Z',
      order: 1,
      visible: true,
    },
    {
      platform: 'gitlab',
      label: 'GitLab',
      url: 'https://gitlab.com/carlosandresbf',
      urlEn: null,
      icon: 'M230.15,117.1,210.25,41a11.94,11.94,0,0,0-22.79-1.11L169.78,88H86.22L68.54,39.87A11.94,11.94,0,0,0,45.75,41L25.85,117.1a57.19,57.19,0,0,0,22,61l73.27,51.76a11.91,11.91,0,0,0,13.74,0l73.27-51.76A57.19,57.19,0,0,0,230.15,117.1ZM58,57.5,73.13,98.76A8,8,0,0,0,80.64,104h94.72a8,8,0,0,0,7.51-5.24L198,57.5l13.07,50L128,166.21,44.9,107.5ZM40.68,124.11,114.13,176,93.41,190.65,57.09,165A41.06,41.06,0,0,1,40.68,124.11Zm87.32,91-20.73-14.65L128,185.8l20.73,14.64ZM198.91,165l-36.32,25.66L141.87,176l73.45-51.9A41.06,41.06,0,0,1,198.91,165Z',
      order: 2,
      visible: true,
    },
    {
      platform: 'whatsapp',
      label: 'WhatsApp',
      url: 'https://wa.me/573202452005?text=Hola%20Carlos%2C%20vi%20tu%20portafolio%20y%20me%20gustar%C3%ADa%20contactarte.',
      urlEn:
        'https://wa.me/573202452005?text=Hi%20Carlos%2C%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20get%20in%20touch.',
      icon: 'M187.58,144.84l-32-16a8,8,0,0,0-8,.5l-14.69,9.8a40.55,40.55,0,0,1-16-16l9.8-14.69a8,8,0,0,0,.5-8l-16-32A8,8,0,0,0,104,64a40,40,0,0,0-40,40,88.1,88.1,0,0,0,88,88,40,40,0,0,0,40-40A8,8,0,0,0,187.58,144.84ZM152,176a72.08,72.08,0,0,1-72-72A24,24,0,0,1,99.29,80.46l11.48,23L101,118a8,8,0,0,0-.73,7.51,56.47,56.47,0,0,0,30.15,30.15A8,8,0,0,0,138,155l14.61-9.74,23,11.48A24,24,0,0,1,152,176ZM128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z',
      order: 3,
      visible: true,
    },
    {
      platform: 'email',
      label: 'Email',
      url: 'mailto:carlosandresbeltran89@gmail.com',
      urlEn: null,
      icon: 'M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z',
      order: 4,
      visible: true,
    },
  ]);

  console.log('✅ Seed completado');
}

// ── Ejecución directa ─────────────────────────────────────────────────────────

if (require.main === module || process.argv[1]?.endsWith('seed.ts')) {
  (async () => {
    try {
      require('dotenv/config');
    } catch {}
    const { DataSource } = await import('typeorm');
    const { allEntities } = await import('../src/entities');
    const ds = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || process.env.POSTGRES_PORT || '5432', 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: allEntities,
      synchronize: false,
      logging: false,
    });
    await ds.initialize();
    await runSeed(ds);
    await ds.destroy();
  })().catch((err) => {
    console.error('❌ Error en seed:', err);
    process.exit(1);
  });
}
