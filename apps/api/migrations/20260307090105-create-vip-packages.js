'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('vip_packages', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      name: Sequelize.STRING,

      price: Sequelize.INTEGER,

      duration_days: Sequelize.INTEGER,

      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }

    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('vip_packages');
  }
};