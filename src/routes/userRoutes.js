const { handleCreateClass } = require("../controller/class");
const { HomePage, LoginPage, AdminPage } = require("../controller/page");
const {
    handleAuthentication,
    handleLogout,
    checkAuthentization,
} = require("../controller/user");

const initPage = (app) => {
    app.get("/", HomePage);
    app.get("/login", LoginPage);
    app.get("/admin", checkAuthentization, AdminPage);
    app.get("/student");
    app.get("/logout", handleLogout);
};

const initUserroutes = (app) => {
    app.post("/authentication", handleAuthentication);
};
module.exports = { initPage, initUserroutes };
