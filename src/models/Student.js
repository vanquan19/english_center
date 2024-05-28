"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Student extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Student.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userID: DataTypes.INTEGER,
            parentID: DataTypes.INTEGER,
            classID: DataTypes.INTEGER,
        },
        {
            sequelize,
            timestamps: false,
            modelName: "Student",
            tableName: "Students",
        }
    );
    return Student;
};
