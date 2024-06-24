"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Salary extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Salary.belongsTo(models.Teacher, {
                foreignKey: "teacherID",
                as: "teacher",
            });
        }
    }
    Salary.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            salary: DataTypes.FLOAT,
            month: DataTypes.STRING,
            year: DataTypes.STRING,
            paidDate: DataTypes.DATE,
            teacherID: DataTypes.INTEGER,
        },
        {
            sequelize,
            timestamps: true,
            updatedAt: false,
            tableName: "salarys",
            modelName: "Salary",
        }
    );
    return Salary;
};
