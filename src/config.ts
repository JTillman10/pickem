import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const apiPrefix = '/api';

// 12 hours
export const loginExipiration = 43200;

export function getPostgresConnectionOptions(): PostgresConnectionOptions {
  if (process.env.DATABASE_URL) {
    return {
      type: 'postgres',
      ssl: true,
      url: process.env.DATABASE_URL,
      entities: [`${__dirname}/**/*.entity{.ts,.js}`],
      synchronize: true,
    };
  } else {
    return {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'me',
      password: 'password',
      database: 'pickem',
      entities: [`${__dirname}/**/*.entity{.ts,.js}`],
      synchronize: true,
    };
  }
}
