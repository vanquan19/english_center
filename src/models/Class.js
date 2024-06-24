"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Class extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Class.belongsTo(models.Teacher, {
                foreignKey: "teacherID",
                as: "teacher",
            });
            Class.hasMany(models.ClassSession, {
                foreignKey: "classID",
                as: "classSession",
            });
            Class.hasMany(models.Student, {
                foreignKey: "classID",
                as: "students",
            });
        }
    }
    Class.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: DataTypes.STRING,
            year: DataTypes.INTEGER,
            startAt: DataTypes.DATE,
            endAt: DataTypes.DATE,
            status: DataTypes.BOOLEAN,
            price: DataTypes.FLOAT,
            teacherID: {
                type: DataTypes.INTEGER,
                references: {
                    model: "Teachers",
                    key: "id",
                },
            },
        },
        {
            sequelize,
            timestamps: true,
            tableName: false,
            modelName: "Class",
            tableName: "Classes",
            hooks: {
                afterCreate: (classInstance, options) => {
                    console.log("Class was created");
                },
            },
        }
    );
    return Class;
};
