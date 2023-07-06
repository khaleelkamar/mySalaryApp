const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const testData = [];

    const password = 'password'; // Set the desired default password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    for (let i = 0; i < 1; i++) {
      const username = `testUser${i}`;
      const email = `user${i}@example.com`;

      testData.push({
        username,
        email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('users', testData, {});

    // Console log the username and password for verification
    console.log('Username:', testData[0].username);
    console.log('Password:', password);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
