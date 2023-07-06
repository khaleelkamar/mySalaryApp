const { QueryTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const testData = [];

    const departments = ['Engineering', 'Sales', 'Marketing', 'Finance', 'Operations'];
    const subDepartments = ['DevOps', 'Backend', 'Frontend'];
    const names = ['John', 'Emma', 'Michael'];
    const onContractValues = [true, false];

    for (let i = 0; i < 20; i++) {
      const departmentIndex = i % departments.length;
      const subDepartmentIndex = i % subDepartments.length;
      const nameIndex = i % names.length;
      const onContractIndex = i % onContractValues.length;

      testData.push({
        name: `${names[nameIndex]}${i}`,
        salary: 14500 + i * 100,
        currency: 'USD',
        on_contract: onContractValues[onContractIndex],
        department: departments[departmentIndex],
        sub_department: `${subDepartments[subDepartmentIndex]}${i}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('salaries', testData, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('salaries', null, {});
  },
};
