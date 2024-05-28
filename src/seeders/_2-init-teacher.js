const { hashPassword } = require("../controller/user");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert("Teachers", [
            {
                id: 1,
                userID: 2,
                salary: 500000,
                teached: 0,
            },
            {
                id: 2,
                userID: 3,
                salary: 500000,
                teached: 0,
            },
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("Teachers", null, {});
    },
};
