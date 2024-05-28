"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Fee extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Fee.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            fee: DataTypes.FLOAT,
            paid: DataTypes.FLOAT,
            outDate: DataTypes.DATE,
            paidDate: DataTypes.DATE,
            discount: DataTypes.FLOAT,
            studentID: DataTypes.INTEGER,
        },
        {
            sequelize,
            timestamps: false,
            tableName: "Fees",
            modelName: "Fee",
        }
    );
    return Fee;
};
