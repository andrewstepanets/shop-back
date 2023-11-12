import * as path from 'path';
import { ConnectionOptions } from 'typeorm';
import { Cart, CartItem } from '../cart/entities';

export const getDatabaseConfig = async (): Promise<ConnectionOptions> => {
  return {
    type: 'postgres',
    host: process.env.PG_HOST,
    port: +process.env.PG_PORT,
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    entities: [Cart, CartItem],
    migrations: [path.join(__dirname, '../migrations/**/*{.ts, .js}')],
    logging: true,
  };
};
