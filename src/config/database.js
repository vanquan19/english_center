const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME || "englishcenter",
    process.env.DB_USERNAME || "root",
    +process.env.DB_PASSWORD || null,
    {
        host: "localhost",
        dialect: "mysql",
    }
);

const connectionDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

const sessionStore = new MySQLStore({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "null",
    database: process.env.DB_NAME || "englishCenter",
    schema: {
        tableName: "sessions",
        columnNames: {
            session_id: "id",
            expires: "expires",
            data: "data",
        },
    },
});
module.exports = { sequelize, sessionStore };
module.exports = connectionDB;
