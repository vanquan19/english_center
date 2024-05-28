const { hashPassword } = require("../controller/user");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert("Parents", [
            {
                id: 1,
                userID: 10,
            },
            {
                id: 2,
                userID: 11,
            },
            {
                id: 3,
                userID: 12,
            },
            {
                id: 4,
                userID: 13,
            },
            {
                id: 5,
                userID: 14,
            },
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("Parents", null, {});
    },
};
