import { Pool } from 'pg';
import { env } from '../env';


export const pool = new Pool({ 
  host: env.db.host,
  port: env.db.port as number,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
});

export async function query(text: string, params?: any[]) {
  return pool.query(text, params);
}
