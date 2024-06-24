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
            Fee.belongsTo(models.Student, {
                foreignKey: "studentID",
                as: "student",
            });
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
            monthOfYear: DataTypes.STRING,
            year: DataTypes.STRING,
            paidDate: DataTypes.DATE,
            studentID: DataTypes.INTEGER,
        },
        {
            sequelize,
            timestamps: true,
            tableName: "Fees",
            modelName: "Fee",
        }
    );
    return Fee;
};
