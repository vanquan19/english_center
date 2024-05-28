"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Users", {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            firstname: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            lastname: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            username: {
                type: DataTypes.STRING,
            },
            email: {
                type: DataTypes.STRING,
            },
            phone: {
                type: DataTypes.STRING(50),
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            address: {
                type: DataTypes.STRING,
            },
            gender: {
                type: DataTypes.BOOLEAN,
            },
            birthday: {
                type: DataTypes.STRING(50),
            },
            role: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "R3",
            },
            createdAt: {
                type: DataTypes.DATE,
            },
            updatedAt: {
                type: DataTypes.DATE,
            },
            deletedAt: {
                type: DataTypes.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Users");
    },
};
