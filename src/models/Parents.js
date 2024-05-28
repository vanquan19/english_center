"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Parent extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Parent.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userID: DataTypes.INTEGER,
            zalo: DataTypes.STRING,
        },
        {
            sequelize,
            timestamps: false,
            modelName: "Parent",
            tableName: "Parents",
        }
    );
    return Parent;
};
