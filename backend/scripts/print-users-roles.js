// Script para mostrar el contenido de users, roles y user_roles
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const { Pool } = pg;
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function main() {
  const users = await pool.query('SELECT * FROM users');
  const roles = await pool.query('SELECT * FROM roles');
  const userRoles = await pool.query('SELECT * FROM user_roles');
  console.log('USERS:', users.rows);
  console.log('ROLES:', roles.rows);
  console.log('USER_ROLES:', userRoles.rows);
  await pool.end();
}

main().catch(console.error);
