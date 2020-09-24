import { Sequelize } from 'sequelize';
import config from './config';

const { db_name, db_dialect, db_username, db_password, db_host } = config;

const sequelize = new Sequelize(
  `${db_dialect}://${db_username}:${db_password}@${db_host}:5432/${db_name}`,
  {
    define: {
      underscored: true,
      charset: 'utf8',
      timestamps: true
    },
    timezone: 'UTC',
   } 
)

const testConnection = async (sequelize: Sequelize) => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    return sequelize;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection(sequelize)

export default sequelize