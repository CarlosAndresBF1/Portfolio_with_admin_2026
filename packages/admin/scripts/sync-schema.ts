/**
 * Sincroniza el schema de TypeORM con la base de datos (crea/actualiza tablas).
 * Ejecutar UNA SOLA VEZ tras el primer deploy.
 *
 * Uso: npx tsx scripts/sync-schema.ts
 */

// dotenv solo es necesario en desarrollo local; en Docker las env vars vienen de compose
try {
  require('dotenv/config');
} catch {}
import { DataSource } from 'typeorm';
import { allEntities } from '../src/entities';

const ds = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'postgres',
  port: parseInt(process.env.DB_PORT || process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: allEntities,
  synchronize: true,
  logging: ['schema'],
});

async function main() {
  console.log('🔄 Sincronizando schema con la base de datos...');
  await ds.initialize();
  console.log('✅ Schema sincronizado — todas las tablas creadas/actualizadas');
  await ds.destroy();
}

main().catch((err) => {
  console.error('❌ Error sincronizando schema:', err);
  process.exit(1);
});
