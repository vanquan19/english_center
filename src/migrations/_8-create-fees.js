"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Fees", {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            fee: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            paid: {
                type: DataTypes.FLOAT,
                defaultValue: 0,
            },
            paidDate: {
                type: DataTypes.DATE,
            },
            monthOfYear: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            year: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            studentID: {
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
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Fees");
    },
};
