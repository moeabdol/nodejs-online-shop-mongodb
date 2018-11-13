const Sequelize = require('sequelize');

const sequelize = new Sequelize('online_shop', 'moeabdol', '12345678', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
  operatorsAliases: false
});

module.exports = sequelize;
