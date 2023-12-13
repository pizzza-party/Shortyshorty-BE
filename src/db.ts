import { Pool } from 'pg';

const connectDatabase = async function () {
  try {
    const db = new Pool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT),
    });

    await db.connect();
    return db;
  } catch (error) {
    console.error(error);
  }
};

export { connectDatabase };
