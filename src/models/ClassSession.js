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
        }
    }
    ClassSession.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            classID: DataTypes.INTEGER,
            date: DataTypes.DATE,
        },
        {
            sequelize,
            tableName: "ClassSessions",
            modelName: "ClassSession",
        }
    );
    return ClassSession;
};
