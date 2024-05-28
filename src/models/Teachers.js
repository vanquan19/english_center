"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Teacher extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
        sta;
    }
    Teacher.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userID: DataTypes.INTEGER,
            salary: DataTypes.FLOAT,
            teached: DataTypes.INTEGER,
            paidSalaryDate: DataTypes.DATE,
        },
        {
            sequelize,
            timestamps: false,
            modelName: "Teacher",
            tableName: "Teachers",
        }
    );
    return Teacher;
};
