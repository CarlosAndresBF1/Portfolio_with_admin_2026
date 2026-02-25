import { DataSource } from 'typeorm';

import { allEntities } from '../entities';

// Prevenir múltiples instancias del DataSource en desarrollo (hot reload)
const globalForDB = globalThis;

function createDataSource() {
  return new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
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
