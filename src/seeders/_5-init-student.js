const { hashPassword } = require("../controller/user");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert("Students", [
            {
                id: 1,
                userID: 4,
                parentID: 1,
                classID: 1,
            },
            {
                id: 2,
                userID: 5,
                parentID: 2,
                classID: 1,
            },
            {
                id: 3,
                userID: 6,
                parentID: 3,
                classID: 1,
            },
            {
                id: 4,
                userID: 7,
                parentID: 4,
                classID: 2,
            },
            {
                id: 5,
                userID: 8,
                parentID: 5,
                classID: 2,
            },
            {
                id: 6,
                userID: 8,
                parentID: 5,
                classID: 2,
            },
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("Students", null, {});
    },
};
