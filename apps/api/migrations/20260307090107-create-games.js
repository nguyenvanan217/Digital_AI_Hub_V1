'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('games', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      name: Sequelize.STRING,

      slug: Sequelize.STRING,

      description: Sequelize.TEXT,

      is_active: Sequelize.BOOLEAN

    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('games');
  }
};