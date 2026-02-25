import { DataSource } from 'typeorm';

import { allEntities } from '../entities';

// Prevenir múltiples instancias del DataSource en desarrollo (hot reload)
const globalForDB = globalThis;

function createDataSource() {
  return new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'postgres',
    port: parseInt(process.env.DB_PORT || process.env.POSTGRES_PORT || '5432', 10),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: allEntities,
    synchronize: false,
    logging: false,
  });
}

export const AppDataSource = globalForDB.__typeormDS ?? createDataSource();

if (process.env.NODE_ENV !== 'production') {
  globalForDB.__typeormDS = AppDataSource;
}

export async function getDB() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
}
