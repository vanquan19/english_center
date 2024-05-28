"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Attendances", {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            classSessionID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "ClassSessions",
                    key: "id",
                },
            },
            studentID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Students",
                    key: "id",
                },
            },
            status: {
                type: DataTypes.BOOLEAN,
                defaultValue: 0,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Attendances");
    },
};
