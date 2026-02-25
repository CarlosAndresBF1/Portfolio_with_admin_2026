/**
 * Script de migración y seed para despliegue.
 * Reemplaza sync-schema.ts + seed.sql en un solo paso.
 *
 * 1. Limpia datos incompatibles con nuevos FK (una sola vez)
 * 2. Sincroniza schema desde las entidades
 * 3. Crea usuario admin si no existe
 * 4. Seed condicional (solo si la BD está vacía o hubo migración)
 *
 * Uso: npx tsx scripts/migrate.ts
 */
try {
  require('dotenv/config');
} catch {}
import { DataSource } from 'typeorm';
import { allEntities } from '../src/entities';
import bcrypt from 'bcryptjs';
import { runSeed } from './seed';

const ds = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'postgres',
  port: parseInt(process.env.DB_PORT || process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: allEntities,
  synchronize: false,
  logging: ['schema'],
});

async function main() {
  console.log('🔄 Iniciando migración...');
  await ds.initialize();

  // ── Pre-sync: limpiar datos incompatibles con nuevos FK ────────────────────
  let needsReseed = false;

  try {
    // Verificar si SkillWorkplace existe y si falta el FK a ExperienceJob
    const fk = await ds.query(`
      SELECT 1 FROM pg_constraint
      WHERE conrelid = '"SkillWorkplace"'::regclass
        AND contype = 'f'
        AND confrelid = '"ExperienceJob"'::regclass
      LIMIT 1
    `);
    if (fk.length === 0) {
      // FK no existe aún → los datos pueden ser incompatibles (migración workplace→jobId)
      await ds.query('DELETE FROM "SkillWorkplace"');
      needsReseed = true;
      console.log('ℹ️  SkillWorkplace limpiada (migración FK pendiente)');
    }
  } catch {
    // Tabla no existe aún (BD nueva) — no hay nada que limpiar
  }

  // ── Sincronizar schema desde EntitySchema ──────────────────────────────────
  console.log('🔄 Sincronizando schema...');
  await ds.synchronize();
  console.log('✅ Schema sincronizado');

  // ── Crear usuario admin ────────────────────────────────────────────────────
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    const userRepo = ds.getRepository('User');
    const existing = await userRepo.findOneBy({ email });
    if (!existing) {
      const hash = await bcrypt.hash(password, 12);
      await userRepo.save({ email, password: hash, name: 'Admin' });
      console.log(`✅ Usuario admin creado: ${email}`);
    } else {
      console.log(`ℹ️  Usuario admin ya existe: ${email}`);
    }
  }

  // ── Seed condicional ───────────────────────────────────────────────────────
  const langCount = await ds.getRepository('Language').count();
  if (langCount === 0 || needsReseed) {
    console.log('🌱 Ejecutando seed...');
    await runSeed(ds);
  } else {
    console.log(`ℹ️  BD ya tiene datos (${langCount} idiomas) — omitiendo seed`);
  }

  await ds.destroy();
  console.log('✅ Migración completada');
}

main().catch((err) => {
  console.error('❌ Error en migración:', err);
  process.exit(1);
});
