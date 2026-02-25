/**
 * Sincroniza el schema de TypeORM con la base de datos (crea/actualiza tablas).
 * Ejecutar UNA SOLA VEZ tras el primer deploy.
 *
 * Uso: npx tsx scripts/sync-schema.ts
 */

import 'dotenv/config';
import { DataSource } from 'typeorm';
import { allEntities } from '../src/entities';

const ds = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
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
