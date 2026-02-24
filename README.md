# Portfolio CMS Monorepo

Monorepo con un portafolio personal (Astro 5 SSR) y un panel de administración CMS (Next.js 16) conectado a PostgreSQL.

## Arquitectura

```
portfolio-monorepo/
├── packages/
│   ├── portfolio/      # Sitio web público (Astro 5 SSR)
│   └── admin/          # Panel CMS (Next.js 16 + Prisma + NextAuth)
├── docker-compose.yml  # Orquestación producción (3 servicios)
├── docker-compose.dev.yml  # Override: solo PostgreSQL
└── .github/workflows/ci.yml
```

**Tecnologías principales:**

| Componente | Stack |
|---|---|
| Portfolio | Astro 5, TypeScript, Bootstrap 5, Sass, Nodemailer |
| Admin CMS | Next.js 16, React 19, MUI 5, Prisma 7, NextAuth v5 |
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

### 3. Instalar dependencias y preparar BD

```bash
pnpm install
pnpm db:generate     # Generar cliente Prisma
pnpm db:migrate:deploy  # Ejecutar migraciones
pnpm db:seed         # Crear usuario admin y datos iniciales
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
| PostgreSQL | `${POSTGRES_PORT}` (5432) | - |
| Admin CMS | `${ADMIN_PORT}` (3059) | http://localhost:3059 |
| Portfolio | `${PORTFOLIO_PORT}` (4321) | http://localhost:4321 |

Después del primer despliegue, ejecutar migraciones y seed:

```bash
docker compose exec admin npx prisma migrate deploy
docker compose exec admin npx tsx prisma/seed.ts
```

### Comandos Docker útiles

```bash
# Ver logs
docker compose logs -f admin
docker compose logs -f portfolio

# Reiniciar un servicio
docker compose restart admin

# Reconstruir imágenes tras cambios
docker compose up --build -d

# Detener todo
docker compose down

# Detener y borrar datos (incluyendo BD)
docker compose down -v
```

## Scripts disponibles

### Raíz del monorepo

| Script | Descripción |
|---|---|
| `pnpm dev` | Inicia admin y portfolio en paralelo |
| `pnpm build` | Construye ambos proyectos |
| `pnpm test` | Ejecuta tests de portfolio y admin |
| `pnpm db:generate` | Genera el cliente Prisma |
| `pnpm db:migrate` | Ejecuta migraciones (dev) |
| `pnpm db:migrate:deploy` | Ejecuta migraciones (producción) |
| `pnpm db:seed` | Ejecuta seed (usuario admin + datos iniciales) |
| `pnpm db:studio` | Abre Prisma Studio |
| `pnpm db:reset` | Resetea la BD completa |

## Variables de entorno

Ver `.env.example` para la lista completa. Variables críticas:

| Variable | Descripción | Requerida |
|---|---|---|
| `DATABASE_URL` | Conexión PostgreSQL | Si |
| `NEXTAUTH_SECRET` | Secreto JWT (generar con `openssl rand -hex 32`) | Si |
| `NEXTAUTH_URL` | URL base del admin | Si |
| `ADMIN_EMAIL` | Email del usuario admin inicial | Si |
| `ADMIN_PASSWORD` | Password del admin inicial | Si |
| `INTERNAL_API_KEY` | Key compartida admin/portfolio (generar con `openssl rand -hex 32`) | Si |
| `SMTP_HOST/USER/PASS` | Configuración SMTP para formulario de contacto | Si |
| `CONTACT_TO_EMAIL` | Email destino del formulario de contacto | Si |

## API interna

El portfolio consume datos del admin via API REST autenticada con `X-API-Key`:

| Endpoint | Método | Descripción |
|---|---|---|
| `/api/v1/portfolio/[lang]` | GET | Todos los datos del portfolio por idioma |
| `/api/v1/portfolio/contact` | POST | Guardar submission del formulario de contacto |
| `/api/health` | GET | Health check (usado por Docker) |

## Tests

```bash
# Todos los tests
pnpm test

# Solo portfolio (62 tests)
pnpm --filter portfolio run test

# Solo admin (38 tests)
pnpm --filter admin run test

# Watch mode
pnpm --filter portfolio run test:watch
pnpm --filter admin run test:watch
```

## Estructura de la BD

El schema Prisma define:

- **Contenido multiidioma** (ES/EN): PersonalInfo, AboutSection, ExperienceJob, Skill, Project, ContactSection, Footer, NavLabels, MetaSeo, MarqueeItems, SummaryCards
- **Formulario de contacto**: ContactSubmission (con IP, estado leído/no leído)
- **Autenticación**: User, Account, Session, VerificationToken (NextAuth)

## Seguridad

- Autenticación JWT con NextAuth v5 en todas las rutas del admin
- `requireAuth()` en todos los Server Actions
- API Key para comunicación interna entre servicios
- Rate limiting en el formulario de contacto (5 req/min por IP)
- Sanitización HTML (XSS prevention) en inputs
- Validación de longitud de campos y formato de email
- Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
- CORS restringido al dominio del portfolio
- Contenedores Docker ejecutan como usuario no-root
- Variables sensibles en `.env` (gitignored)

## CI/CD

GitHub Actions ejecuta en cada push/PR a `main`:

1. **Lint & Test**: ESLint (admin) + Vitest (portfolio + admin)
2. **Build**: Prisma generate + migrate + build de ambos proyectos
3. **Docker Build** (solo en `main`): Construye las imágenes Docker
