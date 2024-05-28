"use strict";

const { Session } = require("express-session");
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Session extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Session.init(
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            expires: DataTypes.DATE,
            data: DataTypes.TEXT,
        },
        {
            sequelize,
            timestamps: false,
            modelName: "Session",
            tableName: "sessions",
        }
    );
    return Session;
};
