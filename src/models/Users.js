"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User.hasOne(models.Student, {
                foreignKey: "userID",
                as: "student",
            });
            User.hasOne(models.Teacher, {
                foreignKey: "userID",
                as: "teacher",
            });
            User.hasOne(models.Parent, {
                foreignKey: "userID",
                as: "parent",
            });
        }
    }
    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            firstname: DataTypes.STRING(50),
            lastname: DataTypes.STRING(50),
            email: DataTypes.STRING,
            phone: DataTypes.STRING(50),
            password: DataTypes.STRING,
            address: DataTypes.STRING,
            gender: DataTypes.BOOLEAN,
            birthday: DataTypes.STRING(50),
            role: DataTypes.STRING,
            deletedAt: DataTypes.DATE,
        },
        {
            sequelize,
            timestamps: true,
            modelName: "User",
        }
    );
    return User;
};
