interface ConfigI {
  db_username: string;
  db_password: string;
  db_name: string;
  db_host: string;
  db_dialect: string;
  jwt_secret: string;
  jwt_refresh_secret: string;
}

const config: ConfigI = {
  db_username: process.env.DB_USERNAME || '',
  db_password: process.env.DB_PASSWORD || '',
  db_name: process.env.DB_NAME || '',
  db_host: process.env.DB_HOST || '',
  db_dialect: process.env.DB_DIALECT || '',
  jwt_secret: process.env.JWT_SECRET || '',
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET || '',
}

export default config