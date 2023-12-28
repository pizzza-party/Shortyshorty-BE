import { Pool } from 'pg';
import { StatusCodes } from 'http-status-codes';
import { CustomError } from './error';

const connectDatabase = async (): Promise<Pool> => {
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
    throw new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'DB Connection Failed',
      error
    );
  }
};

export { connectDatabase };
