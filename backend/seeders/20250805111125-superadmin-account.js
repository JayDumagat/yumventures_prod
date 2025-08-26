'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const salt = await bcrypt.genSalt(10);
    await queryInterface.bulkInsert('Users', [
      {
        firstName: 'Harvey',
        lastName: 'Hunat',
        email: 'hhunat@mail.com',
        username: 'hhunat',
        password: await bcrypt.hash('password123', salt),
        role: 'owner',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Patrick',
        lastName: 'Balaga',
        email: 'pbalaga@mail.com',
        username: 'pbalaga',
        password: await bcrypt.hash('password123', salt),
        role: 'cashier',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Clarence',
        lastName: 'Ticman',
        email: 'cticman@mail.com',
        username: 'cticman',
        password: await bcrypt.hash('password123', salt),
        role: 'customer',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  }
};
