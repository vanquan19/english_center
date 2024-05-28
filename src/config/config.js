require("dotenv").config();

const config = {
    development: {
        username: process.env.DB_USERNAME || "root",
        password: +process.env.DB_PASSWORD || null,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST || "localhost",
        dialect: "mysql",
    },
    test: {
        username: process.env.DB_USERNAME || "root",
        password: process.env.DB_PASSWORD || null,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST || "localhost",
        dialect: "mysql",
    },
    production: {
        username: process.env.DB_USERNAME || "root",
        password: process.env.DB_PASSWORD || null,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST || "localhost",
        dialect: "mysql",
    },
};
module.exports = config;
