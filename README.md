# Portfolio CMS Monorepo

Monorepo con un portafolio personal (Astro 5 SSR) y un panel de administración CMS (Next.js 16) conectado a PostgreSQL.

## Arquitectura

```
portfolio-monorepo/
├── packages/
│   ├── portfolio/          # Sitio web público (Astro 5 SSR)
│   └── admin/              # Panel CMS (Next.js 16 + TypeORM + NextAuth)
├── docker/
│   └── postgres/
│       └── init.sql        # Extensiones PostgreSQL
├── docker-compose.yml      # Orquestación producción (3 servicios)
├── docker-compose.dev.yml  # Override: solo PostgreSQL para dev local
└── .github/workflows/
    ├── ci.yml              # Lint + Test + Build en cada push/PR
    └── deploy.yml          # Deploy automático a VPS en push a main
```

**Tecnologías principales:**

| Componente | Stack |
|---|---|
| Portfolio | Astro 5, TypeScript, Bootstrap 5, Sass, Nodemailer |
| Admin CMS | Next.js 16, React 19, MUI 5, TypeORM 0.3, NextAuth v5 |
| Base de datos | PostgreSQL 16 |
| Infra | Docker, pnpm workspaces, GitHub Actions |

## Requisitos previos

- **Node.js** >= 22
- **pnpm** >= 9
- **Docker** y **Docker Compose** (para BD y despliegue)

## Inicio rápido

### 1. Clonar y configurar variables de entorno

```bash
git clone <repo-url>
cd portfolio-monorepo

# Copiar ejemplo de variables de entorno
cp .env.example .env
cp packages/admin/.env.example packages/admin/.env
cp packages/portfolio/.env.example packages/portfolio/.env
```

Editar `.env` con tus valores reales:

```bash
# Generar secretos seguros:
openssl rand -hex 32  # → NEXTAUTH_SECRET
openssl rand -hex 32  # → INTERNAL_API_KEY
```

### 2. Levantar base de datos (Docker)

```bash
# Solo PostgreSQL (para desarrollo local)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

### 3. Instalar dependencias y cargar datos

```bash
pnpm install

# Migrar schema + seed condicional
pnpm db:migrate

# O solo seed (re-inserta todos los datos)
pnpm db:seed
```

### 4. Desarrollo local

```bash
# Ambos proyectos en paralelo
pnpm dev

# O individualmente
pnpm dev:admin       # http://localhost:3059
pnpm dev:portfolio   # http://localhost:4321
```

## Despliegue con Docker

Levanta los 3 servicios (PostgreSQL + Admin + Portfolio):

```bash
docker compose up --build -d
```

Servicios disponibles:

| Servicio | Puerto | URL |
|---|---|---|
| PostgreSQL | `${POSTGRES_PORT}` (5432) | — |
| Admin CMS | `${ADMIN_PORT}` (3000) | http://localhost:3000 |
| Portfolio | `${PORTFOLIO_PORT}` (4321) | http://localhost:4321 |

Después del primer despliegue, migrar y cargar datos:

```bash
# Migrar schema + seed condicional (todo en un paso)
pnpm docker:migrate

# O solo seed (re-inserta todos los datos)
pnpm docker:seed
```

### Comandos Docker útiles

```bash
docker compose logs -f admin        # Ver logs del admin
docker compose logs -f portfolio    # Ver logs del portfolio
docker compose restart admin        # Reiniciar un servicio
docker compose up --build -d        # Reconstruir tras cambios
docker compose down                 # Detener todo
docker compose down -v              # Detener y borrar datos (incluida BD)
```

## Scripts disponibles

### Raíz del monorepo

| Script | Descripción |
|---|---|
| `pnpm dev` | Inicia admin y portfolio en paralelo |
| `pnpm build` | Construye ambos proyectos |
| `pnpm test` | Ejecuta tests de portfolio y admin |
| `pnpm db:migrate` | Migrar schema + seed condicional |
| `pnpm db:seed` | Seed via TypeORM (datos inline) |
| `pnpm docker:migrate` | `docker compose exec admin tsx scripts/migrate.ts` |
| `pnpm docker:seed` | `docker compose exec admin tsx scripts/seed.ts` |
| `pnpm docker:up` | `docker compose up -d` |
| `pnpm docker:up:build` | `docker compose up --build -d` |
| `pnpm docker:down` | `docker compose down` |
| `pnpm docker:logs` | `docker compose logs -f` |

### Admin (`packages/admin`)

| Script | Descripción |
|---|---|
| `pnpm dev` | Servidor de desarrollo (puerto 3059) |
| `pnpm build` | Build de producción |
| `pnpm lint` | ESLint (errores + warnings) |
| `pnpm lint:fix` | ESLint con auto-fix |
| `pnpm test` | Vitest (38 tests) |
| `pnpm typeorm:migrate` | Migrar schema + seed condicional |
| `pnpm typeorm:seed` | Ejecuta seed.ts con TypeORM |

## Variables de entorno

Ver `.env.example` para la lista completa. Variables críticas:

| Variable | Descripción | Requerida |
|---|---|---|
| `DATABASE_URL` | Conexión PostgreSQL | Sí |
| `NEXTAUTH_SECRET` | Secreto JWT (`openssl rand -hex 32`) | Sí |
| `NEXTAUTH_URL` | URL base del admin | Sí |
| `ADMIN_EMAIL` | Email del usuario admin inicial | Sí |
| `ADMIN_PASSWORD` | Password del admin inicial | Sí |
| `INTERNAL_API_KEY` | Key compartida admin↔portfolio (`openssl rand -hex 32`) | Sí |
| `SMTP_HOST/USER/PASS` | Configuración SMTP para formulario de contacto | Sí |
| `CONTACT_TO_EMAIL` | Email destino del formulario de contacto | Sí |

## Comunicación interna (INTERNAL_API_KEY)

El portfolio (Astro) y el admin (Next.js) se comunican a través de una API REST **interna** dentro de la red Docker. No hay API expuesta públicamente a internet.

### Flujo de comunicación

```
┌─────────────┐    HTTP (red Docker interna)    ┌─────────────┐
│  Portfolio   │ ──────────────────────────────► │  Admin CMS  │
│  (Astro)     │  GET /api/v1/portfolio/[lang]   │  (Next.js)  │
│  puerto 4321 │  POST /api/v1/portfolio/contact │  puerto 3000│
└─────────────┘    Header: X-API-Key: ***        └──────┬──────┘
                                                        │
                                                        ▼
                                                 ┌─────────────┐
                                                 │  PostgreSQL  │
                                                 │  puerto 5432 │
                                                 └─────────────┘
```

1. **Portfolio → Admin**: El portfolio hace `fetch()` al admin usando la URL interna de Docker (`http://admin:3000/api/v1/portfolio/es`) con el header `X-API-Key: <INTERNAL_API_KEY>`.

2. **Autenticación**: El admin valida el header `X-API-Key` contra `process.env.INTERNAL_API_KEY`. Si no coincide, responde `401 Unauthorized`.

3. **Red Docker privada**: Ambos contenedores están en la misma red Docker. Las peticiones nunca salen a internet. El puerto del admin puede no estar expuesto externamente.

4. **Sin API pública**: No hay endpoints abiertos sin autenticación. Todo requiere o el `X-API-Key` (para el portfolio) o una sesión JWT válida (para el panel admin).

### Endpoints internos

| Endpoint | Método | Autenticación | Descripción |
|---|---|---|---|
| `/api/v1/portfolio/[lang]` | GET | `X-API-Key` | Todos los datos del portfolio por idioma (es/en) |
| `/api/v1/portfolio/contact` | POST | `X-API-Key` | Guardar submission del formulario de contacto |
| `/api/health` | GET | Ninguna | Health check (solo Docker) |

## Estructura de la BD

TypeORM define 26 entidades en `packages/admin/src/entities/index.js`:

**Contenido multiidioma (ES/EN):**
- `Language` — Idiomas disponibles (es, en)
- `PersonalInfo` — Nombre, rol, tagline (hero section)
- `MetaSeo` — Título y descripción SEO por idioma
- `NavLabel` — Etiquetas de navegación
- `AboutSection` + `AboutCircleItem` — Sección "Sobre mí"
- `SummaryCard` — Tarjetas resumen
- `MarqueeItem` — Textos del marquee en hero
- `ExperienceJob` + `ExperienceTranslation` + `ExperienceStack` — Experiencia laboral
- `SkillCategory` + `SkillCategoryTranslation` + `Skill` + `SkillTranslation` + `SkillWorkplace` — Habilidades
- `Project` + `ProjectTranslation` + `ProjectStack` — Proyectos
- `ContactSectionTranslation` — Textos del formulario de contacto
- `FooterTranslation` — Textos del footer

**Formulario de contacto:**
- `ContactSubmission` — Mensajes recibidos (con IP, estado leído/no leído)

**Autenticación:**
- `User` — Usuarios admin (email + password hasheado con bcrypt)
- `Account`, `Session`, `VerificationToken` — Tablas NextAuth (sin uso activo, JWT only)

## Panel Admin

| Ruta | Descripción |
|---|---|
| `/dashboard` | Dashboard con estadísticas |
| `/dashboard/content/personal` | Info personal (hero) |
| `/dashboard/content/about` | Sección About |
| `/dashboard/content/summary` | Summary Cards |
| `/dashboard/content/contact-section` | Textos del formulario de contacto |
| `/dashboard/experience` | Experiencia laboral (CRUD) |
| `/dashboard/skills` | Skills (CRUD) |
| `/dashboard/projects` | Proyectos (CRUD) |
| `/dashboard/contacts` | Mensajes de contacto recibidos |
| `/dashboard/profile` | Perfil y cambio de contraseña |

## Seguridad

- Autenticación JWT con NextAuth v5 en todas las rutas del admin
- `requireAuth()` en todos los Server Actions
- API Key para comunicación interna entre servicios (nunca expuesta al navegador)
- Rate limiting en formulario de contacto (5 req/min por IP)
- Sanitización HTML (XSS prevention) en inputs
- Validación de longitud de campos y formato de email
- Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
- CORS restringido al dominio del portfolio
- Contenedores Docker ejecutan como usuario no-root
- Passwords hasheados con bcrypt (12 rounds)
- Variables sensibles en `.env` (gitignored)

## Tests

```bash
pnpm test                              # Todos (65 tests)
pnpm --filter portfolio run test       # Portfolio (27 tests)
pnpm --filter admin run test           # Admin (38 tests)
pnpm --filter portfolio run test:watch # Watch mode
pnpm --filter admin run test:watch
```

## CI/CD

GitHub Actions ejecuta en cada push/PR a `main`:

1. **CI** (`ci.yml`): Lint (ESLint) → Tests (Vitest) → Build (Next.js + Astro) → Docker Build
2. **Deploy** (`deploy.yml`): SSH al VPS → `docker compose up --build -d`
