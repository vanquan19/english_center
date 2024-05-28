const path = require("path");
const configViews = (app) => {
    app.set("views", path.join(__dirname, "../views"));
    app.set("view engine", "ejs");
};
module.exports = configViews;
