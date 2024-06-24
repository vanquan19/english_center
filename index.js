const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const multer = require("multer");
const bodyParser = require("body-parser");
const configViews = require("./src/config/view-engine.js");
const connectionDB = require("./src/config/database.js");
const { sessionStore } = require("./src/config/database.js");
const { initPage, initRouteAdmin, initUserRoutes, initStudentRoutes, initParentRoutes, initTeacherRoutes } = require("./src/routes/routes.js");
const session = require("express-session");
const schedule = require("node-schedule");
const { autoSendMail } = require("./src/util/sendmail.js");

//init PORT
const PORT = process.env.PORT || 3060;
const app = express();

//use express session
app.use(
    session({
        secret: process.env.SECRET || "your_secret_key",
        resave: false, // Không lưu session nếu không có thay đổi
        saveUninitialized: false, // Không lưu session mới nếu không có dữ liệu
        store: sessionStore,
        cookie: {
            secure: false, // Đặt thành true nếu sử dụng HTTPS
            maxAge: 4320000000, // Thời gian sống của cookie (ms)
        },
    })
);

//parser data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());

app.use(express.static(path.join(__dirname, "public")));

//parser file
const upload = multer();

//connect db
connectionDB();

//config view engine
configViews(app);

//init routes
initPage(app);
initRouteAdmin(app, upload);
initUserRoutes(app);
initStudentRoutes(app);
initParentRoutes(app);
initTeacherRoutes(app);

// schedule send mail
const job = schedule.scheduleJob("0 9 25 * *", autoSendMail);
console.log("Job scheduled", job.nextInvocation().toString());
//running app
app.listen(PORT, () => {
    console.log("App is running on port", PORT);
});
