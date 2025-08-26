'use strict';

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

    await queryInterface.bulkInsert('MenuItems', [
      {
        id: '1',
        name: 'Classic Burger',
        description: 'Juicy beef patty with lettuce, tomato, and cheese',
        categoryId: '3', // Main Courses
        price: 8.99,
        image: 'images/burger.jpg',
        status: 'available',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Caesar Salad',
        description: 'Crisp romaine lettuce with Caesar dressing and croutons',
        categoryId: '2', // Appetizers
        price: 6.49,
        image: 'images/salad.jpg',
        status: 'available',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        name: 'Chocolate Cake',
        description: 'Rich chocolate cake with a creamy frosting',
        categoryId: '4', // Desserts
        price: 4.99,
        image: 'images/cake.jpg',
        status: 'available',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('MenuItems', null, {});
  }
};
