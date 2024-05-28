const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const configViews = require("./src/config/view-engine.js");
const connectionDB = require("./src/config/database.js");
const { sessionStore } = require("./src/config/database.js");
const { initUserroutes, initPage } = require("./src/routes/userRoutes.js");
const session = require("express-session");
const PORT = process.env.PORT || 3060;
const app = express();
app.use(
    session({
        secret: process.env.SECRET || "your_secret_key",
        resave: false, // Không lưu session nếu không có thay đổi
        saveUninitialized: false, // Không lưu session mới nếu không có dữ liệu
        store: sessionStore,
        cookie: {
            secure: false, // Đặt thành true nếu sử dụng HTTPS
            maxAge: 600000000, // Thời gian sống của cookie (ms)
        },
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
connectionDB();
configViews(app);
initPage(app);
initUserroutes(app);

app.listen(PORT, () => {
    console.log("App is running on port", PORT);
});
