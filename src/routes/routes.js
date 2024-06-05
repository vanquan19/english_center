const { AdminPage } = require("../controller/admin");
const {
    handleCreateClass,
    handleGetClass,
    handleGetClassById,
    handleManagementCalendar,
    handleGetInfomationClass,
} = require("../controller/class");
const {
    HomePage,
    LoginPage,
    RegisterPage,
} = require("../controller/public-page");
const {
    handleAuthentication,
    handleLogout,
    handleRegister,
} = require("../controller/user");
const { handleAddEvent } = require("../services/class-service");

const initPage = (app) => {
    app.get("/home", HomePage);
    app.get("/login", LoginPage);
    app.get("/logout", handleLogout);
    app.get("/register", RegisterPage);
};

const initRouteAdmin = (app, upload) => {
    app.get("/", AdminPage);
    app.get("/create-class", (req, res) => {
        setTimeout(() => {
            res.render("form-create-class", {
                page: "class-management",
            });
        }, 500);
    });
    app.post("/create-class", upload.single("image"), handleCreateClass);
    app.get("/class-management/:page", handleGetClass);
    app.get("/class-detail/:id", handleGetClassById);
    app.get("/class-management-calendar", handleManagementCalendar);
    app.post("/add-event", handleAddEvent);
    app.get("/class-infomation/:id", handleGetInfomationClass);
};

const initUserRoutes = (app) => {
    app.post("/login", handleAuthentication);
    app.post("/register", handleRegister);
};
module.exports = { initPage, initUserRoutes, initRouteAdmin };
