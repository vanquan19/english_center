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
            status: DataTypes.BOOLEAN,
            price: DataTypes.FLOAT,
            teacherID: DataTypes.INTEGER,
        },
        {
            sequelize,
            timestamps: false,
            tableName: false,
            modelName: "Class",
            tableName: "Classes",
        }
    );
    return Class;
};
