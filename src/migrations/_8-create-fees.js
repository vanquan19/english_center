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
            outDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            paidDate: {
                type: DataTypes.DATE,
            },
            discount: {
                type: DataTypes.FLOAT,
            },
            studentID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Students",
                    key: "id",
                },
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Fees");
    },
};
