const { handleGetBanner } = require("./banner");
const { handleGetClass } = require("./class");

const HomePage = async (req, res) => {
    const banner = await handleGetBanner();
    res.render("index", { banner: banner });
};

const LoginPage = (req, res) => {
    res.render("login");
};

const RegisterPage = (req, res) => {
    res.render("register-form");
};

module.exports = {
    HomePage,
    LoginPage,
    RegisterPage,
};
