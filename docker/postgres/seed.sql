-- =============================================================================
-- Portfolio CMS — SQL Seed (generado desde en.json / es.json)
-- Datos reales de Carlos Andrés Beltrán Franco 
-- =============================================================================

BEGIN;

-- Limpiar datos existentes (orden por dependencias FK)
DELETE FROM "AboutCircleItem";
DELETE FROM "ExperienceStack";
DELETE FROM "ExperienceTranslation";
DELETE FROM "SkillWorkplace";
DELETE FROM "SkillTranslation";
DELETE FROM "SkillCategoryTranslation";
DELETE FROM "ProjectStack";
DELETE FROM "ProjectTranslation";
DELETE FROM "MarqueeItem";
DELETE FROM "SummaryCard";
DELETE FROM "ContactSectionTranslation";
DELETE FROM "FooterTranslation";
DELETE FROM "NavLabel";
DELETE FROM "MetaSeo";
DELETE FROM "PersonalInfo";
DELETE FROM "AboutSection";
DELETE FROM "Skill";
DELETE FROM "SkillCategory";
DELETE FROM "ExperienceJob";
DELETE FROM "Project";
DELETE FROM "ContactSubmission";
DELETE FROM "SocialLink";

-- 1. Languages
INSERT INTO "Language" (id, code, name) VALUES
  ('lang-es', 'es', 'Español'),
  ('lang-en', 'en', 'English')
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name;

CREATE OR REPLACE FUNCTION get_lang_id(lang_code TEXT) RETURNS TEXT AS $$
  SELECT id FROM "Language" WHERE code = lang_code;
$$ LANGUAGE sql STABLE;

-- 2. Personal Info
INSERT INTO "PersonalInfo" (id, "languageId", name, "lastName", role, tagline, "switchLang", "updatedAt") VALUES
  (gen_random_uuid()::text, get_lang_id('es'), 'Carlos Andrés', 'Beltrán', 'Ingeniero de Sistemas & Desarrollador Senior', 'Desarrollador Senior (Backend/Full‑Stack) con 15+ años construyendo APIs y productos web escalables. PHP (Laravel/Lumen) · JS/TS (NestJS, Angular, React) · CI/CD.', 'EN', NOW()),
  (gen_random_uuid()::text, get_lang_id('en'), 'Carlos Andrés', 'Beltrán', 'Systems Engineer & Senior Developer', 'Senior Backend/Full‑Stack developer with 15+ years building scalable APIs and web products. PHP (Laravel/Lumen) · JS/TS (NestJS, Angular, React) · CI/CD.', 'ES', NOW())
ON CONFLICT ("languageId") DO UPDATE SET
  name = EXCLUDED.name, "lastName" = EXCLUDED."lastName", role = EXCLUDED.role,
  tagline = EXCLUDED.tagline, "switchLang" = EXCLUDED."switchLang", "updatedAt" = NOW();

-- 3. SEO Meta
INSERT INTO "MetaSeo" (id, "languageId", title, description, "updatedAt") VALUES
  (gen_random_uuid()::text, get_lang_id('es'), 'Carlos Andrés Beltrán Franco | Ingeniero de Sistemas & Desarrollador Senior', 'Hoja de vida digital de Carlos Andrés Beltrán Franco. Ingeniero de Sistemas con 15+ años en desarrollo de software: PHP (Laravel/Lumen), JS/TS (NestJS, Next.js, Angular, React), bases de datos, integraciones y CI/CD.', NOW()),
  (gen_random_uuid()::text, get_lang_id('en'), 'Carlos Andrés Beltrán Franco | Systems Engineer & Senior Developer', 'Digital resume of Carlos Andrés Beltrán Franco. Systems Engineer with 15+ years in software development: PHP (Laravel/Lumen), JS/TS (NestJS, Next.js, Angular, React), databases, integrations, and CI/CD.', NOW())
ON CONFLICT ("languageId") DO UPDATE SET
  title = EXCLUDED.title, description = EXCLUDED.description, "updatedAt" = NOW();

-- 4. Nav Labels
INSERT INTO "NavLabel" (id, "languageId", home, about, experience, skills, projects, contact, "updatedAt") VALUES
  (gen_random_uuid()::text, get_lang_id('es'), 'Inicio', 'Sobre mí', 'Experiencia', 'Habilidades', 'Proyectos', 'Contacto', NOW()),
  (gen_random_uuid()::text, get_lang_id('en'), 'Home', 'About', 'Experience', 'Skills', 'Projects', 'Contact', NOW())
ON CONFLICT ("languageId") DO UPDATE SET
  home = EXCLUDED.home, about = EXCLUDED.about, experience = EXCLUDED.experience,
  skills = EXCLUDED.skills, projects = EXCLUDED.projects, contact = EXCLUDED.contact, "updatedAt" = NOW();

-- 5. About Section
INSERT INTO "AboutSection" (id, "languageId", title, subtitle, description, location, email, phone, "updatedAt") VALUES
  ('about-es', get_lang_id('es'), 'Sobre Mí', 'Ingeniero de Sistemas', 'Ingeniero de Sistemas y Desarrollador Senior con más de 15 años de experiencia en desarrollo de software. He participado en el diseño e implementación de APIs REST, microservicios y aplicaciones web, integrando servicios como Twilio, SendGrid y Firebase. Me enfoco en arquitectura limpia, rendimiento, pruebas automatizadas, CI/CD y trabajo ágil (Scrum).', 'Ibagué, Tolima, Colombia', 'carlosandresbeltran89@gmail.com', '+57 320 245 2005', NOW()),
  ('about-en', get_lang_id('en'), 'About Me', 'Systems Engineer', 'Systems Engineer and Senior Developer with 15+ years of experience in software development. I have contributed to designing and delivering REST APIs, microservices, and web applications, integrating services such as Twilio, SendGrid, and Firebase. I focus on clean architecture, performance, automated testing, CI/CD, and agile delivery (Scrum).', 'Ibagué, Tolima, Colombia', 'carlosandresbeltran89@gmail.com', '+57 320 245 2005', NOW())
ON CONFLICT ("languageId") DO UPDATE SET
  title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, description = EXCLUDED.description,
  location = EXCLUDED.location, email = EXCLUDED.email, phone = EXCLUDED.phone, "updatedAt" = NOW();

-- About Circle Items (ES)
INSERT INTO "AboutCircleItem" (id, "aboutSectionId", label, "order") VALUES
  (gen_random_uuid()::text, 'about-es', 'Perfil', 0),
  (gen_random_uuid()::text, 'about-es', 'Código', 1),
  (gen_random_uuid()::text, 'about-es', 'Sistemas', 2),
  (gen_random_uuid()::text, 'about-es', 'Educación', 3),
  (gen_random_uuid()::text, 'about-es', 'Trabajo', 4),
  (gen_random_uuid()::text, 'about-es', 'Contacto', 5);

-- About Circle Items (EN)
INSERT INTO "AboutCircleItem" (id, "aboutSectionId", label, "order") VALUES
  (gen_random_uuid()::text, 'about-en', 'Profile', 0),
  (gen_random_uuid()::text, 'about-en', 'Code', 1),
  (gen_random_uuid()::text, 'about-en', 'Systems', 2),
  (gen_random_uuid()::text, 'about-en', 'Education', 3),
  (gen_random_uuid()::text, 'about-en', 'Work', 4),
  (gen_random_uuid()::text, 'about-en', 'Contact', 5);

-- 6. Summary Cards
INSERT INTO "SummaryCard" (id, "languageId", "order", title, heading, text, "updatedAt") VALUES
  -- ES
  (gen_random_uuid()::text, get_lang_id('es'), 0, 'Experiencia', 'Experiencia', '15+ años construyendo software web de punta a punta. Enfoque fuerte en backend y APIs (Laravel/Lumen, NestJS), integración de servicios (Twilio, SendGrid, Firebase), y despliegues confiables con CI/CD.', NOW()),
  (gen_random_uuid()::text, get_lang_id('es'), 1, 'Proyectos', 'Proyectos', 'He participado en plataformas empresariales y productos digitales con módulos administrativos, integraciones y automatización de despliegues. Esta hoja de vida digital resume experiencia, stack y logros por rol.', NOW()),
  (gen_random_uuid()::text, get_lang_id('es'), 2, 'Habilidades', 'Habilidades', 'Stack principal: PHP (Laravel/Lumen/CodeIgniter), JavaScript/TypeScript (NestJS, Next.js, Angular, React) y C#/.NET. Bases de datos: MySQL, PostgreSQL y SQL Server. Buenas prácticas: pruebas automatizadas, CI/CD y trabajo ágil.', NOW()),
  (gen_random_uuid()::text, get_lang_id('es'), 3, 'Trabajo Actual', 'Trabajando En', 'Desarrollador Senior en INMOV - AX MARKETING (desde sep. 2018). Desarrollo de APIs y microservicios, integraciones y automatización de despliegues con Bitbucket Pipelines (reducción de tiempos de despliegue ~30%).', NOW()),
  (gen_random_uuid()::text, get_lang_id('es'), 4, 'Sobre Mí', 'Sobre Mí', 'Me apasiona construir soluciones simples de mantener y fáciles de escalar. Priorizo claridad, calidad y colaboración: buenas prácticas, documentación, pruebas y entrega continua.', NOW()),
  (gen_random_uuid()::text, get_lang_id('es'), 5, 'Perfil', 'Carlos Andrés Beltrán Franco', 'Ingeniero de Sistemas y Desarrollador Senior. Experiencia en backend, APIs, microservicios y desarrollo full‑stack, con enfoque en rendimiento, calidad y entrega ágil.', NOW()),
  -- EN
  (gen_random_uuid()::text, get_lang_id('en'), 0, 'Experience', 'Experience', '15+ years building end-to-end web software. Strong focus on backend and APIs (Laravel/Lumen, NestJS), third‑party integrations (Twilio, SendGrid, Firebase), and reliable deployments through CI/CD.', NOW()),
  (gen_random_uuid()::text, get_lang_id('en'), 1, 'Projects', 'Projects', 'I have contributed to business platforms and digital products including admin modules, integrations, and deployment automation. This digital resume highlights experience, stack, and outcomes per role.', NOW()),
  (gen_random_uuid()::text, get_lang_id('en'), 2, 'Skills', 'Skills', 'Core stack: PHP (Laravel/Lumen/CodeIgniter), JavaScript/TypeScript (NestJS, Next.js, Angular, React), and C#/.NET. Databases: MySQL, PostgreSQL, SQL Server. Practices: testing, CI/CD, and agile delivery.', NOW()),
  (gen_random_uuid()::text, get_lang_id('en'), 3, 'Current Work', 'Working On', 'Senior Developer at INMOV - AX MARKETING (since Sep 2018). Building APIs and microservices, integrations, and CI/CD automation with Bitbucket Pipelines (deployment time reduced by ~30%).', NOW()),
  (gen_random_uuid()::text, get_lang_id('en'), 4, 'About Me', 'About Me', 'I enjoy building software that is easy to maintain and scale. I value clarity, quality, and collaboration: best practices, documentation, automated testing, and continuous delivery.', NOW()),
  (gen_random_uuid()::text, get_lang_id('en'), 5, 'Profile', 'Carlos Andrés Beltrán Franco', 'Systems Engineer and Senior Developer. Experienced in backend, APIs, microservices, and full‑stack delivery, with a focus on performance, quality, and agile execution.', NOW());

-- 7. Marquee Items
INSERT INTO "MarqueeItem" (id, "languageId", text, "order") VALUES
  -- ES
  (gen_random_uuid()::text, get_lang_id('es'), 'PHP', 0),
  (gen_random_uuid()::text, get_lang_id('es'), 'Laravel', 1),
  (gen_random_uuid()::text, get_lang_id('es'), 'Lumen', 2),
  (gen_random_uuid()::text, get_lang_id('es'), 'NestJS', 3),
  (gen_random_uuid()::text, get_lang_id('es'), 'Next.js', 4),
  (gen_random_uuid()::text, get_lang_id('es'), 'Angular', 5),
  (gen_random_uuid()::text, get_lang_id('es'), 'React', 6),
  (gen_random_uuid()::text, get_lang_id('es'), 'C#/.NET', 7),
  (gen_random_uuid()::text, get_lang_id('es'), 'JavaScript', 8),
  (gen_random_uuid()::text, get_lang_id('es'), 'TypeScript', 9),
  (gen_random_uuid()::text, get_lang_id('es'), 'MySQL', 10),
  (gen_random_uuid()::text, get_lang_id('es'), 'PostgreSQL', 11),
  (gen_random_uuid()::text, get_lang_id('es'), 'SQL Server', 12),
  (gen_random_uuid()::text, get_lang_id('es'), 'Git', 13),
  (gen_random_uuid()::text, get_lang_id('es'), 'Bitbucket', 14),
  (gen_random_uuid()::text, get_lang_id('es'), 'Jira', 15),
  (gen_random_uuid()::text, get_lang_id('es'), 'Confluence', 16),
  (gen_random_uuid()::text, get_lang_id('es'), 'Firebase', 17),
  (gen_random_uuid()::text, get_lang_id('es'), 'Twilio', 18),
  (gen_random_uuid()::text, get_lang_id('es'), 'SendGrid', 19),
  (gen_random_uuid()::text, get_lang_id('es'), 'Scrum', 20),
  (gen_random_uuid()::text, get_lang_id('es'), 'CI/CD', 21),
  (gen_random_uuid()::text, get_lang_id('es'), 'Docker', 22),
  (gen_random_uuid()::text, get_lang_id('es'), 'Microservicios', 23),
  (gen_random_uuid()::text, get_lang_id('es'), 'Cypress', 24),
  (gen_random_uuid()::text, get_lang_id('es'), 'TestRail', 25),
  (gen_random_uuid()::text, get_lang_id('es'), 'PHPUnit', 26),
  (gen_random_uuid()::text, get_lang_id('es'), 'Jest', 27),
  -- EN
  (gen_random_uuid()::text, get_lang_id('en'), 'PHP', 0),
  (gen_random_uuid()::text, get_lang_id('en'), 'Laravel', 1),
  (gen_random_uuid()::text, get_lang_id('en'), 'Lumen', 2),
  (gen_random_uuid()::text, get_lang_id('en'), 'NestJS', 3),
  (gen_random_uuid()::text, get_lang_id('en'), 'Next.js', 4),
  (gen_random_uuid()::text, get_lang_id('en'), 'Angular', 5),
  (gen_random_uuid()::text, get_lang_id('en'), 'React', 6),
  (gen_random_uuid()::text, get_lang_id('en'), 'C#/.NET', 7),
  (gen_random_uuid()::text, get_lang_id('en'), 'JavaScript', 8),
  (gen_random_uuid()::text, get_lang_id('en'), 'TypeScript', 9),
  (gen_random_uuid()::text, get_lang_id('en'), 'MySQL', 10),
  (gen_random_uuid()::text, get_lang_id('en'), 'PostgreSQL', 11),
  (gen_random_uuid()::text, get_lang_id('en'), 'SQL Server', 12),
  (gen_random_uuid()::text, get_lang_id('en'), 'Git', 13),
  (gen_random_uuid()::text, get_lang_id('en'), 'Bitbucket', 14),
  (gen_random_uuid()::text, get_lang_id('en'), 'Jira', 15),
  (gen_random_uuid()::text, get_lang_id('en'), 'Confluence', 16),
  (gen_random_uuid()::text, get_lang_id('en'), 'Firebase', 17),
  (gen_random_uuid()::text, get_lang_id('en'), 'Twilio', 18),
  (gen_random_uuid()::text, get_lang_id('en'), 'SendGrid', 19),
  (gen_random_uuid()::text, get_lang_id('en'), 'Scrum', 20),
  (gen_random_uuid()::text, get_lang_id('en'), 'CI/CD', 21),
  (gen_random_uuid()::text, get_lang_id('en'), 'Docker', 22),
  (gen_random_uuid()::text, get_lang_id('en'), 'Microservices', 23),
  (gen_random_uuid()::text, get_lang_id('en'), 'Cypress', 24),
  (gen_random_uuid()::text, get_lang_id('en'), 'TestRail', 25),
  (gen_random_uuid()::text, get_lang_id('en'), 'PHPUnit', 26),
  (gen_random_uuid()::text, get_lang_id('en'), 'Jest', 27);

-- 8. Experience Jobs
INSERT INTO "ExperienceJob" (id, number, company, "periodStart", "periodEnd", "order", "createdAt", "updatedAt") VALUES
  ('job-01', '01', 'INMOV - AX MARKETING', 'Septiembre 2018', 'Actualidad', 0, NOW(), NOW()),
  ('job-02', '02', 'BLOSSOM', 'Febrero 2026', 'Febrero 2026', 1, NOW(), NOW()),
  ('job-03', '03', 'SENA INSTITUTE', '2016', '2018', 2, NOW(), NOW()),
  ('job-04', '04', 'IMAGINAMOS SAS', 'Septiembre 2016', 'Marzo 2017', 3, NOW(), NOW()),
  ('job-05', '05', 'Mercadeo y Tecnología', 'Mayo 2015', 'Marzo 2016', 4, NOW(), NOW()),
  ('job-06', '06', 'AC Webmasters', 'Marzo 2013', 'Febrero 2015', 5, NOW(), NOW()),
  ('job-07', '07', 'Soluciones Web Colombia S.A.S.', 'Julio 2012', 'Febrero 2013', 6, NOW(), NOW());

-- Experience Translations (ES)
INSERT INTO "ExperienceTranslation" (id, "jobId", "languageId", role, summary, details) VALUES
  (gen_random_uuid()::text, 'job-01', get_lang_id('es'), 'Desarrollador Senior', 'Diseño y desarrollo de APIs REST y microservicios con Laravel, Lumen y NestJS. Integraciones con Twilio, SendGrid y Firebase.', 'Automatización de despliegues con Bitbucket Pipelines (reducción ~30%). Desarrollo de aplicaciones híbridas con Cordova y Angular. Trabajo ágil (Scrum) usando Jira y Confluence.'),
  (gen_random_uuid()::text, 'job-02', get_lang_id('es'), 'Desarrollador Full‑Stack', 'Desarrollo en PHP para un sistema financiero integrado de Credit Unions en EE. UU.', 'Desarrollo y mantenimiento de módulos backend y frontend, con foco en seguridad, calidad y escalabilidad.'),
  (gen_random_uuid()::text, 'job-03', get_lang_id('es'), 'Instructor de Tecnología', 'Formación en desarrollo de software: C#/ASP.NET, PHP, MySQL, jQuery y HTML5.', 'Diseño de guías prácticas, retos y proyectos aplicados para aprendices. Acompañamiento y fortalecimiento de competencias técnicas.'),
  (gen_random_uuid()::text, 'job-04', get_lang_id('es'), 'Desarrollador de Software', 'Desarrollo de aplicaciones a medida con PHP y CodeIgniter (MVC).', 'Integración con MySQL y Oracle. Entrega de funcionalidades por alcance en modalidad contrato por obra o labor.'),
  (gen_random_uuid()::text, 'job-05', get_lang_id('es'), 'Analista y Desarrollador', 'Desarrollo de software a medida bajo MVC CodeIgniter y PyroCMS.', 'Análisis de requerimientos, implementación y soporte evolutivo en soluciones PHP.'),
  (gen_random_uuid()::text, 'job-06', get_lang_id('es'), 'Líder de Proyectos y Desarrollador', 'Dirección y ejecución de proyectos de desarrollo web.', 'Planificación, seguimiento y desarrollo de aplicaciones con CodeIgniter (MVC).'),
  (gen_random_uuid()::text, 'job-07', get_lang_id('es'), 'Analista y Desarrollador', 'Desarrollo de aplicaciones a medida con CodeIgniter (MVC).', 'Participación en proyectos para clientes corporativos: análisis, desarrollo y entrega.');

-- Experience Translations (EN)
INSERT INTO "ExperienceTranslation" (id, "jobId", "languageId", role, summary, details) VALUES
  (gen_random_uuid()::text, 'job-01', get_lang_id('en'), 'Senior Developer', 'Designed and built REST APIs and microservices with Laravel, Lumen, and NestJS. Integrations with Twilio, SendGrid, and Firebase.', 'Implemented CI/CD with Bitbucket Pipelines (deployment time reduced by ~30%). Built hybrid apps with Cordova and Angular. Agile delivery (Scrum) with Jira and Confluence.'),
  (gen_random_uuid()::text, 'job-02', get_lang_id('en'), 'Full‑Stack Developer', 'PHP development for an integrated financial system for Credit Unions in the US.', 'Built and maintained backend and frontend modules with a focus on security, quality, and scalability.'),
  (gen_random_uuid()::text, 'job-03', get_lang_id('en'), 'Technology Instructor', 'Software development training: C#/ASP.NET, PHP, MySQL, jQuery, and HTML5.', 'Created hands‑on guides and applied projects. Mentored students and strengthened technical skills.'),
  (gen_random_uuid()::text, 'job-04', get_lang_id('en'), 'Software Developer', 'Custom application development using PHP and CodeIgniter (MVC).', 'Worked with MySQL and Oracle integrations. Delivered scoped features under contract-based engagements.'),
  (gen_random_uuid()::text, 'job-05', get_lang_id('en'), 'Analyst & Developer', 'Custom software development under MVC CodeIgniter and PyroCMS.', 'Requirements analysis, implementation, and ongoing improvements for PHP solutions.'),
  (gen_random_uuid()::text, 'job-06', get_lang_id('en'), 'Project Lead & Developer', 'Led and delivered web development projects.', 'Planning, execution, and delivery of CodeIgniter (MVC) applications.'),
  (gen_random_uuid()::text, 'job-07', get_lang_id('en'), 'Analyst & Developer', 'Custom application development with CodeIgniter (MVC).', 'Contributed to corporate client projects: analysis, development, and delivery.');

-- Experience Stack
INSERT INTO "ExperienceStack" (id, "jobId", tech, "order") VALUES
  -- Job 01: INMOV
  (gen_random_uuid()::text, 'job-01', 'PHP', 0),
  (gen_random_uuid()::text, 'job-01', 'Laravel', 1),
  (gen_random_uuid()::text, 'job-01', 'Lumen', 2),
  (gen_random_uuid()::text, 'job-01', 'NestJs', 3),
  (gen_random_uuid()::text, 'job-01', 'Next.js', 4),
  (gen_random_uuid()::text, 'job-01', 'React', 5),
  (gen_random_uuid()::text, 'job-01', 'Cordova', 6),
  (gen_random_uuid()::text, 'job-01', 'Angular', 7),
  (gen_random_uuid()::text, 'job-01', 'Twilio', 8),
  (gen_random_uuid()::text, 'job-01', 'SendGrid', 9),
  (gen_random_uuid()::text, 'job-01', 'Firebase', 10),
  (gen_random_uuid()::text, 'job-01', 'CI/CD', 11),
  (gen_random_uuid()::text, 'job-01', 'Scrum', 12),
  -- Job 02: BLOSSOM
  (gen_random_uuid()::text, 'job-02', 'PHP', 0),
  (gen_random_uuid()::text, 'job-02', 'JavaScript', 1),
  (gen_random_uuid()::text, 'job-02', 'PostgreSQL', 2),
  (gen_random_uuid()::text, 'job-02', 'REST API', 3),
  (gen_random_uuid()::text, 'job-02', 'Git', 4),
  (gen_random_uuid()::text, 'job-02', 'Docker', 5),
  -- Job 03: SENA
  (gen_random_uuid()::text, 'job-03', 'C#', 0),
  (gen_random_uuid()::text, 'job-03', 'ASP.NET', 1),
  (gen_random_uuid()::text, 'job-03', 'PHP', 2),
  (gen_random_uuid()::text, 'job-03', 'Laravel', 3),
  (gen_random_uuid()::text, 'job-03', 'Blade', 4),
  (gen_random_uuid()::text, 'job-03', 'React', 5),
  (gen_random_uuid()::text, 'job-03', 'MySQL', 6),
  (gen_random_uuid()::text, 'job-03', 'JQuery', 7),
  (gen_random_uuid()::text, 'job-03', 'HTML5', 8),
  -- Job 04: IMAGINAMOS
  (gen_random_uuid()::text, 'job-04', 'PHP', 0),
  (gen_random_uuid()::text, 'job-04', 'CodeIgniter', 1),
  (gen_random_uuid()::text, 'job-04', 'MySQL', 2),
  (gen_random_uuid()::text, 'job-04', 'Oracle', 3),
  -- Job 05: Mercadeo y Tecnología
  (gen_random_uuid()::text, 'job-05', 'PHP', 0),
  (gen_random_uuid()::text, 'job-05', 'CodeIgniter', 1),
  (gen_random_uuid()::text, 'job-05', 'PyroCMS', 2),
  -- Job 06: AC Webmasters
  (gen_random_uuid()::text, 'job-06', 'PHP', 0),
  (gen_random_uuid()::text, 'job-06', 'CodeIgniter', 1),
  (gen_random_uuid()::text, 'job-06', 'Gestión de Proyectos', 2),
  -- Job 07: Soluciones Web Colombia
  (gen_random_uuid()::text, 'job-07', 'PHP', 0),
  (gen_random_uuid()::text, 'job-07', 'CodeIgniter', 1);

-- 9. Skill Categories & Skills
INSERT INTO "SkillCategory" (id, "order", "createdAt") VALUES
  ('cat-01', 0, NOW()),
  ('cat-02', 1, NOW()),
  ('cat-03', 2, NOW()),
  ('cat-04', 3, NOW()),
  ('cat-05', 4, NOW());

INSERT INTO "SkillCategoryTranslation" (id, "categoryId", "languageId", name) VALUES
  (gen_random_uuid()::text, 'cat-01', get_lang_id('es'), 'Lenguajes & Frameworks'),
  (gen_random_uuid()::text, 'cat-02', get_lang_id('es'), 'Bases de Datos'),
  (gen_random_uuid()::text, 'cat-03', get_lang_id('es'), 'DevOps & Herramientas'),
  (gen_random_uuid()::text, 'cat-04', get_lang_id('es'), 'QA y Pruebas'),
  (gen_random_uuid()::text, 'cat-05', get_lang_id('es'), 'Metodologías'),
  (gen_random_uuid()::text, 'cat-01', get_lang_id('en'), 'Languages & Frameworks'),
  (gen_random_uuid()::text, 'cat-02', get_lang_id('en'), 'Databases'),
  (gen_random_uuid()::text, 'cat-03', get_lang_id('en'), 'DevOps & Tools'),
  (gen_random_uuid()::text, 'cat-04', get_lang_id('en'), 'QA & Testing'),
  (gen_random_uuid()::text, 'cat-05', get_lang_id('en'), 'Methodologies');

-- Cat 01: Languages & Frameworks (11 skills)
INSERT INTO "Skill" (id, "categoryId", "order", years, "createdAt") VALUES
  ('skill-php',        'cat-01', 0,  '15+', NOW()),
  ('skill-laravel',    'cat-01', 1,  '7+',  NOW()),
  ('skill-lumen',      'cat-01', 2,  '7+',  NOW()),
  ('skill-codeigniter','cat-01', 3,  '5+',  NOW()),
  ('skill-nestjs',     'cat-01', 4,  '5+',  NOW()),
  ('skill-nextjs',     'cat-01', 5,  '2+',  NOW()),
  ('skill-angular',    'cat-01', 6,  '5+',  NOW()),
  ('skill-react',      'cat-01', 7,  '3+',  NOW()),
  ('skill-javascript', 'cat-01', 8,  '15+', NOW()),
  ('skill-typescript', 'cat-01', 9,  '5+',  NOW()),
  ('skill-csharp',     'cat-01', 10, '2+',  NOW());

INSERT INTO "SkillTranslation" (id, "skillId", "languageId", name, description) VALUES
  -- ES
  (gen_random_uuid()::text, 'skill-php',        get_lang_id('es'), 'PHP', 'Dominio experto con más de 15 años. Lenguaje principal para backend: APIs, servicios y aplicaciones web.'),
  (gen_random_uuid()::text, 'skill-laravel',    get_lang_id('es'), 'Laravel', 'Experiencia avanzada en el framework. Usado extensivamente para desarrollo de APIs REST, microservicios y aplicaciones full-stack en INMOV - AX MARKETING.'),
  (gen_random_uuid()::text, 'skill-lumen',      get_lang_id('es'), 'Lumen', 'Framework ligero de Laravel utilizado para construir microservicios y APIs de alto rendimiento.'),
  (gen_random_uuid()::text, 'skill-codeigniter',get_lang_id('es'), 'CodeIgniter', 'Framework MVC utilizado a lo largo de la carrera profesional para desarrollo de aplicaciones personalizadas.'),
  (gen_random_uuid()::text, 'skill-nestjs',     get_lang_id('es'), 'NestJS', 'Framework moderno de Node.js utilizado para construir aplicaciones del lado del servidor escalables y microservicios.'),
  (gen_random_uuid()::text, 'skill-nextjs',     get_lang_id('es'), 'Next.js', 'Framework React para renderizado del lado del servidor y generación de sitios estáticos.'),
  (gen_random_uuid()::text, 'skill-angular',    get_lang_id('es'), 'Angular', 'Framework frontend usado para desarrollo de aplicaciones híbridas con Cordova en INMOV - AX MARKETING.'),
  (gen_random_uuid()::text, 'skill-react',      get_lang_id('es'), 'React', 'Librería de UI basada en componentes para construir aplicaciones web modernas e interactivas.'),
  (gen_random_uuid()::text, 'skill-javascript', get_lang_id('es'), 'JavaScript', 'Lenguaje base para desarrollo web, usado en proyectos frontend y backend (Node.js).'),
  (gen_random_uuid()::text, 'skill-typescript', get_lang_id('es'), 'TypeScript', 'Superconjunto tipado de JavaScript usado con NestJS y Angular para código más seguro y mantenible.'),
  (gen_random_uuid()::text, 'skill-csharp',     get_lang_id('es'), 'C#/.NET', 'Usado para desarrollo ASP.NET y enseñanza en SENA INSTITUTE. Desarrollo de aplicaciones empresariales.'),
  -- EN
  (gen_random_uuid()::text, 'skill-php',        get_lang_id('en'), 'PHP', 'Expert-level proficiency with 15+ years. Primary backend language for APIs, services, and web applications.'),
  (gen_random_uuid()::text, 'skill-laravel',    get_lang_id('en'), 'Laravel', 'Advanced framework expertise. Used extensively for REST API development, microservices, and full-stack applications at INMOV - AX MARKETING.'),
  (gen_random_uuid()::text, 'skill-lumen',      get_lang_id('en'), 'Lumen', 'Lightweight Laravel framework used for building high-performance microservices and APIs.'),
  (gen_random_uuid()::text, 'skill-codeigniter',get_lang_id('en'), 'CodeIgniter', 'MVC framework used throughout career for custom application development across multiple companies.'),
  (gen_random_uuid()::text, 'skill-nestjs',     get_lang_id('en'), 'NestJS', 'Modern Node.js framework used for building scalable server-side applications and microservices.'),
  (gen_random_uuid()::text, 'skill-nextjs',     get_lang_id('en'), 'Next.js', 'React framework for server-side rendering and static site generation.'),
  (gen_random_uuid()::text, 'skill-angular',    get_lang_id('en'), 'Angular', 'Frontend framework used for hybrid application development with Cordova at INMOV - AX MARKETING.'),
  (gen_random_uuid()::text, 'skill-react',      get_lang_id('en'), 'React', 'Component-based UI library for building modern, interactive web applications.'),
  (gen_random_uuid()::text, 'skill-javascript', get_lang_id('en'), 'JavaScript', 'Core language for web development, used across frontend and backend (Node.js) projects.'),
  (gen_random_uuid()::text, 'skill-typescript', get_lang_id('en'), 'TypeScript', 'Typed superset of JavaScript used with NestJS and Angular for safer, more maintainable code.'),
  (gen_random_uuid()::text, 'skill-csharp',     get_lang_id('en'), 'C#/.NET', 'Used for ASP.NET development and teaching at SENA INSTITUTE. Enterprise-grade application development.');

INSERT INTO "SkillWorkplace" (id, "skillId", workplace, "order") VALUES
  (gen_random_uuid()::text, 'skill-php', 'BLOSSOM', 0),
  (gen_random_uuid()::text, 'skill-php', 'INMOV - AX MARKETING', 1),
  (gen_random_uuid()::text, 'skill-php', 'SENA INSTITUTE', 2),
  (gen_random_uuid()::text, 'skill-php', 'IMAGINAMOS SAS', 3),
  (gen_random_uuid()::text, 'skill-php', 'Mercadeo y Tecnología', 4),
  (gen_random_uuid()::text, 'skill-php', 'AC Webmasters', 5),
  (gen_random_uuid()::text, 'skill-php', 'Soluciones Web Colombia', 6),
  (gen_random_uuid()::text, 'skill-laravel', 'BLOSSOM', 0),
  (gen_random_uuid()::text, 'skill-laravel', 'INMOV - AX MARKETING', 1),
  (gen_random_uuid()::text, 'skill-lumen', 'INMOV - AX MARKETING', 0),
  (gen_random_uuid()::text, 'skill-codeigniter', 'IMAGINAMOS SAS', 0),
  (gen_random_uuid()::text, 'skill-codeigniter', 'Mercadeo y Tecnología', 1),
  (gen_random_uuid()::text, 'skill-codeigniter', 'AC Webmasters', 2),
  (gen_random_uuid()::text, 'skill-codeigniter', 'Soluciones Web Colombia', 3),
  (gen_random_uuid()::text, 'skill-nestjs', 'INMOV - AX MARKETING', 0),
  (gen_random_uuid()::text, 'skill-nextjs', 'INMOV - AX MARKETING', 0),
  (gen_random_uuid()::text, 'skill-angular', 'INMOV - AX MARKETING', 0),
  (gen_random_uuid()::text, 'skill-react', 'BLOSSOM', 0),
  (gen_random_uuid()::text, 'skill-react', 'INMOV - AX MARKETING', 1),
  (gen_random_uuid()::text, 'skill-javascript', 'INMOV - AX MARKETING', 0),
  (gen_random_uuid()::text, 'skill-javascript', 'SENA INSTITUTE', 1),
  (gen_random_uuid()::text, 'skill-javascript', 'IMAGINAMOS SAS', 2),
  (gen_random_uuid()::text, 'skill-javascript', 'Mercadeo y Tecnología', 3),
  (gen_random_uuid()::text, 'skill-javascript', 'AC Webmasters', 4),
  (gen_random_uuid()::text, 'skill-javascript', 'Soluciones Web Colombia', 5),
  (gen_random_uuid()::text, 'skill-typescript', 'INMOV - AX MARKETING', 0),
  (gen_random_uuid()::text, 'skill-csharp', 'SENA INSTITUTE', 0);

-- Cat 02: Databases (3 skills)
INSERT INTO "Skill" (id, "categoryId", "order", years, "createdAt") VALUES
  ('skill-mysql',      'cat-02', 0, '15+', NOW()),
  ('skill-postgresql', 'cat-02', 1, '5+',  NOW()),
  ('skill-sqlserver',  'cat-02', 2, '2+',  NOW());

INSERT INTO "SkillTranslation" (id, "skillId", "languageId", name, description) VALUES
  (gen_random_uuid()::text, 'skill-mysql',      get_lang_id('es'), 'MySQL', 'Base de datos relacional principal usada en la mayoría de proyectos. Experto en diseño, optimización y gestión.'),
  (gen_random_uuid()::text, 'skill-postgresql', get_lang_id('es'), 'PostgreSQL', 'Base de datos avanzada de código abierto usada para requerimientos complejos de datos y escalabilidad.'),
  (gen_random_uuid()::text, 'skill-sqlserver',  get_lang_id('es'), 'SQL Server', 'Plataforma de base de datos Microsoft usada en proyectos empresariales .NET.'),
  (gen_random_uuid()::text, 'skill-mysql',      get_lang_id('en'), 'MySQL', 'Primary relational database used across most projects. Expert in design, optimization, and management.'),
  (gen_random_uuid()::text, 'skill-postgresql', get_lang_id('en'), 'PostgreSQL', 'Advanced open-source database used for complex data requirements and scalability.'),
  (gen_random_uuid()::text, 'skill-sqlserver',  get_lang_id('en'), 'SQL Server', 'Microsoft database platform used in enterprise .NET projects.');

INSERT INTO "SkillWorkplace" (id, "skillId", workplace, "order") VALUES
  (gen_random_uuid()::text, 'skill-mysql', 'BLOSSOM', 0),
  (gen_random_uuid()::text, 'skill-mysql', 'INMOV - AX MARKETING', 1),
  (gen_random_uuid()::text, 'skill-mysql', 'SENA INSTITUTE', 2),
  (gen_random_uuid()::text, 'skill-mysql', 'IMAGINAMOS SAS', 3),
  (gen_random_uuid()::text, 'skill-mysql', 'Mercadeo y Tecnología', 4),
  (gen_random_uuid()::text, 'skill-mysql', 'AC Webmasters', 5),
  (gen_random_uuid()::text, 'skill-mysql', 'Soluciones Web Colombia', 6),
  (gen_random_uuid()::text, 'skill-postgresql', 'INMOV - AX MARKETING', 0),
  (gen_random_uuid()::text, 'skill-sqlserver', 'SENA INSTITUTE', 0);

-- Cat 03: DevOps & Tools (7 skills)
INSERT INTO "Skill" (id, "categoryId", "order", years, "createdAt") VALUES
  ('skill-git',        'cat-03', 0, '10+', NOW()),
  ('skill-bitbucket',  'cat-03', 1, '7+',  NOW()),
  ('skill-docker',     'cat-03', 2, '5+',  NOW()),
  ('skill-cicd',       'cat-03', 3, '5+',  NOW()),
  ('skill-firebase',   'cat-03', 4, '5+',  NOW()),
  ('skill-jira',       'cat-03', 5, '7+',  NOW()),
  ('skill-confluence', 'cat-03', 6, '7+',  NOW());

INSERT INTO "SkillTranslation" (id, "skillId", "languageId", name, description) VALUES
  (gen_random_uuid()::text, 'skill-git',        get_lang_id('es'), 'Git', 'Sistema de control de versiones utilizado diariamente para desarrollo colaborativo y gestión de código.'),
  (gen_random_uuid()::text, 'skill-bitbucket',  get_lang_id('es'), 'Bitbucket', 'Plataforma de hosting Git con pipelines CI/CD integrados. Herramienta principal en INMOV - AX MARKETING.'),
  (gen_random_uuid()::text, 'skill-docker',     get_lang_id('es'), 'Docker', 'Plataforma de contenedores para entornos de desarrollo y despliegue consistentes.'),
  (gen_random_uuid()::text, 'skill-cicd',       get_lang_id('es'), 'CI/CD', 'Integración y Despliegue Continuo con Bitbucket Pipelines, reduciendo tiempos de despliegue en un 30%.'),
  (gen_random_uuid()::text, 'skill-firebase',   get_lang_id('es'), 'Firebase', 'Plataforma de Google para bases de datos en tiempo real, autenticación y notificaciones push.'),
  (gen_random_uuid()::text, 'skill-jira',       get_lang_id('es'), 'Jira', 'Herramienta de gestión de proyectos usada para planificación ágil de sprints y seguimiento de tareas.'),
  (gen_random_uuid()::text, 'skill-confluence', get_lang_id('es'), 'Confluence', 'Plataforma de documentación usada para docs técnicos y colaboración de equipo.'),
  (gen_random_uuid()::text, 'skill-git',        get_lang_id('en'), 'Git', 'Version control system used daily for collaborative development and code management.'),
  (gen_random_uuid()::text, 'skill-bitbucket',  get_lang_id('en'), 'Bitbucket', 'Git hosting platform with integrated CI/CD pipelines. Primary tool at INMOV - AX MARKETING.'),
  (gen_random_uuid()::text, 'skill-docker',     get_lang_id('en'), 'Docker', 'Container platform for consistent development and deployment environments.'),
  (gen_random_uuid()::text, 'skill-cicd',       get_lang_id('en'), 'CI/CD', 'Continuous Integration and Deployment with Bitbucket Pipelines, reducing deployment times by 30%.'),
  (gen_random_uuid()::text, 'skill-firebase',   get_lang_id('en'), 'Firebase', 'Google platform for real-time databases, authentication, and push notifications.'),
  (gen_random_uuid()::text, 'skill-jira',       get_lang_id('en'), 'Jira', 'Project management tool used for agile sprint planning and task tracking.'),
  (gen_random_uuid()::text, 'skill-confluence', get_lang_id('en'), 'Confluence', 'Documentation platform used for technical docs and team collaboration.');

INSERT INTO "SkillWorkplace" (id, "skillId", workplace, "order") VALUES
  (gen_random_uuid()::text, 'skill-git', 'INMOV - AX MARKETING', 0),
  (gen_random_uuid()::text, 'skill-git', 'IMAGINAMOS SAS', 1),
  (gen_random_uuid()::text, 'skill-git', 'AC Webmasters', 2),
  (gen_random_uuid()::text, 'skill-bitbucket', 'INMOV - AX MARKETING', 0),
  (gen_random_uuid()::text, 'skill-docker', 'INMOV - AX MARKETING', 0),
  (gen_random_uuid()::text, 'skill-cicd', 'INMOV - AX MARKETING', 0),
  (gen_random_uuid()::text, 'skill-firebase', 'INMOV - AX MARKETING', 0),
  (gen_random_uuid()::text, 'skill-jira', 'INMOV - AX MARKETING', 0),
  (gen_random_uuid()::text, 'skill-confluence', 'INMOV - AX MARKETING', 0);

-- Cat 04: QA & Testing (5 skills)
INSERT INTO "Skill" (id, "categoryId", "order", years, "createdAt") VALUES
  ('skill-cypress',  'cat-04', 0, '3+', NOW()),
  ('skill-testrail', 'cat-04', 1, '3+', NOW()),
  ('skill-pest',     'cat-04', 2, '3+', NOW()),
  ('skill-phpunit',  'cat-04', 3, '5+', NOW()),
  ('skill-jest',     'cat-04', 4, '3+', NOW());

INSERT INTO "SkillTranslation" (id, "skillId", "languageId", name, description) VALUES
  (gen_random_uuid()::text, 'skill-cypress',  get_lang_id('es'), 'Cypress', 'Framework de pruebas de extremo a extremo (E2E) para aplicaciones web.'),
  (gen_random_uuid()::text, 'skill-testrail', get_lang_id('es'), 'TestRail', 'Plataforma de gestión de casos de prueba para organizar y dar seguimiento a esfuerzos de pruebas.'),
  (gen_random_uuid()::text, 'skill-pest',     get_lang_id('es'), 'Pest', 'Framework de pruebas PHP con sintaxis elegante para pruebas unitarias y de funcionalidad.'),
  (gen_random_uuid()::text, 'skill-phpunit',  get_lang_id('es'), 'PHPUnit', 'El framework estándar de pruebas PHP para pruebas unitarias. Usado para escribir pruebas automatizadas que aseguran la calidad y confiabilidad del código.'),
  (gen_random_uuid()::text, 'skill-jest',     get_lang_id('es'), 'Jest', 'Framework de pruebas JavaScript para pruebas unitarias y de integración. Usado con proyectos NestJS y React.'),
  (gen_random_uuid()::text, 'skill-cypress',  get_lang_id('en'), 'Cypress', 'End-to-end testing framework for web applications.'),
  (gen_random_uuid()::text, 'skill-testrail', get_lang_id('en'), 'TestRail', 'Test case management platform for organizing and tracking testing efforts.'),
  (gen_random_uuid()::text, 'skill-pest',     get_lang_id('en'), 'Pest', 'PHP testing framework with elegant syntax for unit and feature testing.'),
  (gen_random_uuid()::text, 'skill-phpunit',  get_lang_id('en'), 'PHPUnit', 'The standard PHP testing framework for unit testing. Used for writing automated tests ensuring code quality and reliability.'),
  (gen_random_uuid()::text, 'skill-jest',     get_lang_id('en'), 'Jest', 'JavaScript testing framework for unit and integration tests. Used with NestJS and React projects.');

INSERT INTO "SkillWorkplace" (id, "skillId", workplace, "order") VALUES
  (gen_random_uuid()::text, 'skill-cypress', 'INMOV - AX MARKETING', 0),
  (gen_random_uuid()::text, 'skill-testrail', 'INMOV - AX MARKETING', 0),
  (gen_random_uuid()::text, 'skill-pest', 'INMOV - AX MARKETING', 0),
  (gen_random_uuid()::text, 'skill-phpunit', 'INMOV - AX MARKETING', 0),
  (gen_random_uuid()::text, 'skill-phpunit', 'IMAGINAMOS SAS', 1),
  (gen_random_uuid()::text, 'skill-jest', 'INMOV - AX MARKETING', 0);

-- Cat 05: Methodologies (3 skills)
INSERT INTO "Skill" (id, "categoryId", "order", years, "createdAt") VALUES
  ('skill-scrum',         'cat-05', 0, '7+',  NOW()),
  ('skill-mvc',           'cat-05', 1, '15+', NOW()),
  ('skill-microservices', 'cat-05', 2, '5+',  NOW());

INSERT INTO "SkillTranslation" (id, "skillId", "languageId", name, description) VALUES
  (gen_random_uuid()::text, 'skill-scrum',         get_lang_id('es'), 'Scrum', 'Metodología ágil aplicada en el día a día con planificación de sprints, reuniones diarias de seguimiento y retrospectivas.'),
  (gen_random_uuid()::text, 'skill-mvc',           get_lang_id('es'), 'MVC', 'Patrón de arquitectura Modelo-Vista-Controlador usado a través de frameworks PHP.'),
  (gen_random_uuid()::text, 'skill-microservices', get_lang_id('es'), 'Microservicios', 'Patrón de arquitectura distribuida para construir aplicaciones escalables y mantenibles.'),
  (gen_random_uuid()::text, 'skill-scrum',         get_lang_id('en'), 'Scrum', 'Agile methodology applied daily with sprint planning, daily standups, and retrospectives.'),
  (gen_random_uuid()::text, 'skill-mvc',           get_lang_id('en'), 'MVC', 'Model-View-Controller architecture pattern used across PHP frameworks.'),
  (gen_random_uuid()::text, 'skill-microservices', get_lang_id('en'), 'Microservices', 'Distributed architecture pattern for building scalable, maintainable applications.');

INSERT INTO "SkillWorkplace" (id, "skillId", workplace, "order") VALUES
  (gen_random_uuid()::text, 'skill-scrum', 'INMOV - AX MARKETING', 0),
  (gen_random_uuid()::text, 'skill-mvc', 'INMOV - AX MARKETING', 0),
  (gen_random_uuid()::text, 'skill-mvc', 'IMAGINAMOS SAS', 1),
  (gen_random_uuid()::text, 'skill-mvc', 'Mercadeo y Tecnología', 2),
  (gen_random_uuid()::text, 'skill-mvc', 'AC Webmasters', 3),
  (gen_random_uuid()::text, 'skill-mvc', 'Soluciones Web Colombia', 4),
  (gen_random_uuid()::text, 'skill-microservices', 'INMOV - AX MARKETING', 0);

-- 10. Projects
INSERT INTO "Project" (id, "order", "createdAt", "updatedAt") VALUES
  ('proj-01', 0, NOW(), NOW()),
  ('proj-02', 1, NOW(), NOW()),
  ('proj-03', 2, NOW(), NOW()),
  ('proj-04', 3, NOW(), NOW()),
  ('proj-05', 4, NOW(), NOW());

INSERT INTO "ProjectTranslation" (id, "projectId", "languageId", title, description) VALUES
  (gen_random_uuid()::text, 'proj-01', get_lang_id('es'), 'INMOV Platform', 'Plataforma empresarial con APIs REST, microservicios y aplicaciones híbridas. Integraciones con Twilio, SendGrid y Firebase.'),
  (gen_random_uuid()::text, 'proj-01', get_lang_id('en'), 'INMOV Platform', 'Enterprise platform with REST APIs, microservices and hybrid applications. Integrations with Twilio, SendGrid, and Firebase.'),
  (gen_random_uuid()::text, 'proj-02', get_lang_id('es'), 'CI/CD Pipeline', 'Pipeline de integración continua con Bitbucket, reduciendo tiempos de despliegue en un 30 %.'),
  (gen_random_uuid()::text, 'proj-02', get_lang_id('en'), 'CI/CD Pipeline', 'Continuous integration pipeline with Bitbucket, reducing deployment times by 30%.'),
  (gen_random_uuid()::text, 'proj-03', get_lang_id('es'), 'Plataforma Educativa', 'Material didáctico y proyectos aplicados para formación técnica en SENA.'),
  (gen_random_uuid()::text, 'proj-03', get_lang_id('en'), 'Education Platform', 'Teaching materials and applied projects for technical training at SENA.'),
  (gen_random_uuid()::text, 'proj-04', get_lang_id('es'), 'Apps Híbridas', 'Desarrollo de aplicaciones móviles híbridas con Cordova y Angular.'),
  (gen_random_uuid()::text, 'proj-04', get_lang_id('en'), 'Hybrid Apps', 'Hybrid mobile application development with Cordova and Angular.'),
  (gen_random_uuid()::text, 'proj-05', get_lang_id('es'), 'Soluciones Corporativas', 'Aplicaciones web a medida con CodeIgniter para clientes corporativos.'),
  (gen_random_uuid()::text, 'proj-05', get_lang_id('en'), 'Corporate Solutions', 'Custom web applications with CodeIgniter for corporate clients.');

INSERT INTO "ProjectStack" (id, "projectId", tech, "order") VALUES
  (gen_random_uuid()::text, 'proj-01', 'Laravel', 0),
  (gen_random_uuid()::text, 'proj-01', 'NestJS', 1),
  (gen_random_uuid()::text, 'proj-01', 'Angular', 2),
  (gen_random_uuid()::text, 'proj-02', 'Bitbucket', 0),
  (gen_random_uuid()::text, 'proj-02', 'Docker', 1),
  (gen_random_uuid()::text, 'proj-03', 'C#', 0),
  (gen_random_uuid()::text, 'proj-03', 'PHP', 1),
  (gen_random_uuid()::text, 'proj-03', 'MySQL', 2),
  (gen_random_uuid()::text, 'proj-04', 'Cordova', 0),
  (gen_random_uuid()::text, 'proj-04', 'Angular', 1),
  (gen_random_uuid()::text, 'proj-05', 'PHP', 0),
  (gen_random_uuid()::text, 'proj-05', 'CodeIgniter', 1);

-- 11. Contact Section
INSERT INTO "ContactSectionTranslation" (id, "languageId", title, "titleHighlight", subtitle, "formName", "formEmail", "formSubject", "formMessage", "formSend", "formSending", "formSuccess", "formError", "updatedAt") VALUES
  (gen_random_uuid()::text, get_lang_id('es'), 'Hablemos', 'Conectemos', '¡Me encantaría saber de ti! Ya sea que tengas una pregunta, una idea de proyecto o simplemente quieras saludar, no dudes en contactarme.', 'Nombre', 'Correo electrónico', 'Asunto', 'Mensaje', 'Enviar', 'Enviando...', '¡Mensaje enviado exitosamente!', 'Error al enviar el mensaje. Por favor intenta de nuevo.', NOW()),
  (gen_random_uuid()::text, get_lang_id('en'), 'Let''s', 'Connect', 'I''d love to hear from you! Whether you have a question, a project idea, or just want to say hello, feel free to reach out.', 'Name', 'Email', 'Subject', 'Message', 'Send', 'Sending...', 'Message sent successfully!', 'Error sending message. Please try again.', NOW())
ON CONFLICT ("languageId") DO UPDATE SET
  title = EXCLUDED.title, "titleHighlight" = EXCLUDED."titleHighlight", subtitle = EXCLUDED.subtitle,
  "formName" = EXCLUDED."formName", "formEmail" = EXCLUDED."formEmail", "formSubject" = EXCLUDED."formSubject",
  "formMessage" = EXCLUDED."formMessage", "formSend" = EXCLUDED."formSend", "formSending" = EXCLUDED."formSending",
  "formSuccess" = EXCLUDED."formSuccess", "formError" = EXCLUDED."formError", "updatedAt" = NOW();

-- 11. Footer
INSERT INTO "FooterTranslation" (id, "languageId", name, email, "updatedAt") VALUES
  (gen_random_uuid()::text, get_lang_id('es'), 'Carlos Andrés Beltrán Franco', 'carlosandresbeltran89@gmail.com', NOW()),
  (gen_random_uuid()::text, get_lang_id('en'), 'Carlos Andrés Beltrán Franco', 'carlosandresbeltran89@gmail.com', NOW())
ON CONFLICT ("languageId") DO UPDATE SET
  name = EXCLUDED.name, email = EXCLUDED.email, "updatedAt" = NOW();

-- 12. Social Links
INSERT INTO "SocialLink" (id, platform, label, url, "urlEn", icon, "order", visible, "createdAt", "updatedAt") VALUES
  (gen_random_uuid()::text, 'linkedin', 'LinkedIn', 'https://www.linkedin.com/in/carlos-andrés-beltrán-franco-3b17a649', NULL, 'M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z', 0, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'github', 'GitHub', 'https://github.com/CarlosAndresBF1', NULL, 'M208.31,75.68A59.78,59.78,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H124A59.75,59.75,0,0,0,76,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,56,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,96,192v8H72a24,24,0,0,1-24-24A40,40,0,0,0,8,136a8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40H96v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,216,112v-8A58.14,58.14,0,0,0,208.31,75.68ZM200,112a40,40,0,0,1-40,40H112a40,40,0,0,1-40-40v-8a41.74,41.74,0,0,1,6.9-22.48A8,8,0,0,0,80,73.55a43.81,43.81,0,0,1,.79-33.58,43.88,43.88,0,0,1,32.32,20.06A8,8,0,0,0,119.82,64h32.35a8,8,0,0,0,6.74-3.69,43.87,43.87,0,0,1,32.32-20.06A43.81,43.81,0,0,1,192,73.55a8,8,0,0,0,1.1,7.69A41.72,41.72,0,0,1,200,104Z', 1, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'gitlab', 'GitLab', 'https://gitlab.com/carlosandresbf', NULL, 'M230.15,117.1,210.25,41a11.94,11.94,0,0,0-22.79-1.11L169.78,88H86.22L68.54,39.87A11.94,11.94,0,0,0,45.75,41L25.85,117.1a57.19,57.19,0,0,0,22,61l73.27,51.76a11.91,11.91,0,0,0,13.74,0l73.27-51.76A57.19,57.19,0,0,0,230.15,117.1ZM58,57.5,73.13,98.76A8,8,0,0,0,80.64,104h94.72a8,8,0,0,0,7.51-5.24L198,57.5l13.07,50L128,166.21,44.9,107.5ZM40.68,124.11,114.13,176,93.41,190.65,57.09,165A41.06,41.06,0,0,1,40.68,124.11Zm87.32,91-20.73-14.65L128,185.8l20.73,14.64ZM198.91,165l-36.32,25.66L141.87,176l73.45-51.9A41.06,41.06,0,0,1,198.91,165Z', 2, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'whatsapp', 'WhatsApp', 'https://wa.me/573202452005?text=Hola%20Carlos%2C%20vi%20tu%20portafolio%20y%20me%20gustar%C3%ADa%20contactarte.', 'https://wa.me/573202452005?text=Hi%20Carlos%2C%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20get%20in%20touch.', 'M187.58,144.84l-32-16a8,8,0,0,0-8,.5l-14.69,9.8a40.55,40.55,0,0,1-16-16l9.8-14.69a8,8,0,0,0,.5-8l-16-32A8,8,0,0,0,104,64a40,40,0,0,0-40,40,88.1,88.1,0,0,0,88,88,40,40,0,0,0,40-40A8,8,0,0,0,187.58,144.84ZM152,176a72.08,72.08,0,0,1-72-72A24,24,0,0,1,99.29,80.46l11.48,23L101,118a8,8,0,0,0-.73,7.51,56.47,56.47,0,0,0,30.15,30.15A8,8,0,0,0,138,155l14.61-9.74,23,11.48A24,24,0,0,1,152,176ZM128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z', 3, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'email', 'Email', 'mailto:carlosandresbeltran89@gmail.com', NULL, 'M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z', 4, true, NOW(), NOW());

-- Limpiar función auxiliar
DROP FUNCTION IF EXISTS get_lang_id(TEXT);

-- 13. Admin User (password: hash bcrypt de ADMIN_PASSWORD)
-- Solo inserta si no existe, para no sobreescribir cambios de contraseña
INSERT INTO "User" (id, name, email, password)
VALUES (
  gen_random_uuid()::text,
  'Admin',
  'carlosandresbeltran89@gmail.com',
  '$2b$12$uPTiO9rGIRDfcoTmKbe5DOnmw5F2bD.BSKR8Z8FvurSeAMEDSTl9i'
)
ON CONFLICT (email) DO NOTHING;

COMMIT;
