"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Notification extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Notification.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            recipientID: DataTypes.INTEGER,
            message: DataTypes.TEXT,
            dateSend: DataTypes.DATE,
            status: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            timestamps: false,
            tableName: "Notifications",
            modelName: "Notification",
        }
    );
    return Notification;
};
