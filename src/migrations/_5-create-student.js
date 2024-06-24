"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Students", {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            userID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Users",
                    key: "id",
                },
            },
            parentID: {
                type: DataTypes.INTEGER,
                references: {
                    model: "Parents",
                    key: "id",
                },
            },
            classID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Classes",
                    key: "id",
                },
            },
            discount: {
                type: DataTypes.FLOAT,
                defaultValue: 0,
                notNull: true,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Students");
    },
};
