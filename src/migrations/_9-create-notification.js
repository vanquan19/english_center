"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Notifications", {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            recipientID: {
                type: DataTypes.INTEGER,
                references: {
                    model: "Users",
                    key: "id",
                },
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            dateSend: {
                type: DataTypes.DATE,
            },
            status: {
                type: DataTypes.BOOLEAN,
                defaultValue: 0,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Notifications");
    },
};
