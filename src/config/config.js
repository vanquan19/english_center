require("dotenv").config();

const config = {
    development: {
        username: process.env.DB_USERNAME || "root",
        password: +process.env.DB_PASSWORD || null,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST || "localhost",
        dialect: "mysql",
        query: {
            raw: true,
        },
        logging: false,
    },
    test: {
        username: process.env.DB_USERNAME || "root",
        password: process.env.DB_PASSWORD || null,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST || "localhost",
        dialect: "mysql",
        query: {
            raw: true,
        },
        logging: false,
    },
    production: {
        username: process.env.DB_USERNAME || "root",
        password: process.env.DB_PASSWORD || null,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST || "localhost",
        dialect: "mysql",
        query: {
            raw: true,
        },
        logging: false,
    },
};
module.exports = config;
