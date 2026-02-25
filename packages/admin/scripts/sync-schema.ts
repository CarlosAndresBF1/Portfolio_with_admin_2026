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
import bcrypt from 'bcryptjs';

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

  // Seed admin user si no existe
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    const userRepo = ds.getRepository('User');
    const existing = await userRepo.findOneBy({ email });
    if (!existing) {
      const hash = await bcrypt.hash(password, 12);
      await userRepo.save({
        email,
        password: hash,
        name: 'Admin',
      });
      console.log(`✅ Usuario admin creado: ${email}`);
    } else {
      console.log(`ℹ️  Usuario admin ya existe: ${email}`);
    }
  }

  await ds.destroy();
}

main().catch((err) => {
  console.error('❌ Error sincronizando schema:', err);
  process.exit(1);
});
