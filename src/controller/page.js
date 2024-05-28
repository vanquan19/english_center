const { handleGetBanner } = require("./banner");

const HomePage = async (req, res) => {
    const banner = await handleGetBanner();
    res.render("index", { banner: banner });
};

const LoginPage = (req, res) => {
    res.render("login");
};

const AdminPage = async (req, res) => {
    const banner = await handleGetBanner();
    res.render("admin", { banner: banner });
};
const TeacherPage = (req, res) => {
    res.render("teacher");
};
const StudentPage = (req, res) => {
    res.render("student");
};
const ParentPage = (req, res) => {};

module.exports = {
    HomePage,
    LoginPage,
    AdminPage,
    TeacherPage,
    StudentPage,
    ParentPage,
};
