"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Scores", {
            id: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            studentID: {
                type: DataTypes.INTEGER,
                references: {
                    model: "Students",
                    key: "id",
                },
            },
            nameExam: {
                type: DataTypes.STRING,
            },
            value: {
                type: DataTypes.FLOAT,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Scores");
    },
};
