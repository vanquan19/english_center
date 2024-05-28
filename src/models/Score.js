"use strict";

const { Session } = require("express-session");
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Score extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Score.init(
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            student_id: DataTypes.INTEGER,
            nameExam: DataTypes.STRING,
            value: DataTypes.FLOAT,
        },
        {
            sequelize,
            timestamps: false,
            modelName: "Score",
            tableName: "Scores",
        }
    );
    return Score;
};
