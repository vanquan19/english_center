const { handleGetBanner } = require("./banner");

const HomePage = async (req, res) => {
    const banner = await handleGetBanner();
    res.render("home", { banner: banner });
};

const LoginPage = (req, res) => {
    const alert = { ...req.session.alert };
    req.session.alert = null;
    res.render("login", { alert, alert });
};

const RegisterPage = (req, res) => {
    res.render("register");
};

module.exports = {
    HomePage,
    LoginPage,
    RegisterPage,
};
