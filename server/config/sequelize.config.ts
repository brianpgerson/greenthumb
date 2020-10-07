import config from './config';
import { Options } from 'sequelize'

const { db_name, db_username, db_dialect, db_password, db_host } = config;

const dbConfig: Options = {
  dialect: db_dialect,
  database: db_name,
  username: db_username,
  password: db_password,
  host: db_host,
  port: 5432,
  define: {
    underscored: true,
    charset: 'utf8',
    timestamps: true, 
},
  timezone: 'UTC',
 }

export const development = dbConfig;
export const local = dbConfig;
export const test = dbConfig;
export const production = dbConfig;


export default dbConfig;