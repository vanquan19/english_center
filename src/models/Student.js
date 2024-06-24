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
            Student.belongsTo(models.User, {
                foreignKey: "userID",
                as: "user",
            });
            Student.belongsTo(models.Parent, {
                foreignKey: "parentID",
                as: "parent",
            });
            Student.belongsTo(models.Class, {
                foreignKey: "classID",
                as: "classes",
            });
            Student.hasMany(models.Attendance, {
                foreignKey: "studentID",
                as: "attendances",
            });
        }
    }
    Student.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userID: {
                type: DataTypes.INTEGER,
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
