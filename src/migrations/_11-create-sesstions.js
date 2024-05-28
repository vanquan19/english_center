"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("sessions", {
            id: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            expires: {
                type: DataTypes.DATE,
            },
            data: {
                type: DataTypes.TEXT,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("sessions");
    },
};
