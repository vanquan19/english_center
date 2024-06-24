"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Attendance extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Attendance.belongsTo(models.ClassSession, {
                foreignKey: "classSessionID",
                as: "classSession",
            });
            Attendance.belongsTo(models.Student, {
                foreignKey: "studentID",
                as: "student",
            });
        }
    }
    Attendance.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            classSessionID: DataTypes.INTEGER,
            studentID: DataTypes.INTEGER,
            status: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            timestamps: false,
            tableName: false,
            modelName: "Attendance",
            tableName: "Attendances",
        }
    );
    return Attendance;
};
