"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Banner extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Banner.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            image: DataTypes.TEXT,
            content: DataTypes.TEXT,
            startDate: DataTypes.DATE,
            endDate: DataTypes.DATE,
        },
        {
            sequelize,
            timestamps: false,
            tableName: "Banners",
            modelName: "Banner",
        }
    );
    return Banner;
};
