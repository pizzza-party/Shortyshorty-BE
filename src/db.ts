import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE!,
  process.env.MYSQL_USER!,
  process.env.MYSQL_PASSWORD,
  {
    host: 'mysql',
    port: Number(process.env.MYSQL_PORT),
    dialect: 'mysql',
  }
);

(async function () {
  await sequelize.authenticate();
})();

const Url = sequelize.define(
  'url',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    originUrl: { type: DataTypes.TEXT, allowNull: false },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Url;
