"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class ClassSession extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            ClassSession.belongsTo(models.Class, {
                foreignKey: "classID",
                as: "class",
            });
            ClassSession.hasMany(models.Attendance, {
                foreignKey: "classSessionID",
                as: "attendances",
            });
        }
    }
    ClassSession.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            classID: {
                type: DataTypes.INTEGER,
                references: {
                    model: "classes",
                    key: "id",
                },
            },
            date: DataTypes.DATE,
            shift: DataTypes.STRING,
        },
        {
            sequelize,
            tableName: "ClassSessions",
            modelName: "ClassSession",
            timestamps: false,
        }
    );
    return ClassSession;
};
