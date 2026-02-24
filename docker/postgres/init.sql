-- Este script se ejecuta solo si la base de datos no existe.
-- postgres:16-alpine crea la DB indicada en POSTGRES_DB automáticamente,
-- así que aquí solo aseguramos extensiones y permisos adicionales.

-- Activar extensión para UUIDs (usada por Prisma con @default(uuid()))
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
