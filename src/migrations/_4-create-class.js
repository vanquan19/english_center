"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Classes", {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            year: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            startAt: {
                type: DataTypes.DATE,
            },
            status: {
                type: DataTypes.BOOLEAN,
                defaultValue: 0,
            },
            price: {
                type: DataTypes.FLOAT,
            },
            teacherID: {
                type: DataTypes.INTEGER,
                references: {
                    model: "Teachers",
                    key: "id",
                },
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Classes");
    },
};
