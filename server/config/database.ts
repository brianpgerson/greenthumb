import { Sequelize } from 'sequelize';
import dbConfig from './sequelize.config';

const sequelize = new Sequelize(dbConfig);

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