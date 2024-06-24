"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Salarys", {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            salary: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },

            paidDate: {
                type: DataTypes.DATE,
            },
            month: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            year: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            teacherID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Students",
                    key: "id",
                },
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Salarys");
    },
};
