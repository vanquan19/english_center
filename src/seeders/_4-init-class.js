const { hashPassword } = require("../controller/user");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert("Classes", [
            {
                id: 1,
                name: "Lớp 3",
                year: 2024,
                startAt: new Date("07-01-2024"),
                status: 1,
                price: 10000000,
                teacherID: 1,
            },
            {
                id: 2,
                name: "Lớp 4",
                year: 2024,
                startAt: new Date("07-01-2024"),
                status: 1,
                price: 10000000,
                teacherID: 2,
            },
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("Classes", null, {});
    },
};
