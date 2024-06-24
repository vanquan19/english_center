const {
    handleAccountant,
    handleGetStudent,
    handleGetTeacher,
    handleGetStudentDetail,
    handleGetTeacherDetail,
    handleGetAllSchedule,
    handleAnalysis,
    handleUpdateUser,
    handleGetSeriesMonth,
    handleGetHistoryAttendance,
    handleGetFeeAnalysis,
} = require("../controller/admin");
const { handleGetBanner } = require("../controller/banner");
const { handleCreateClass, handleGetClass, handleGetClassById, handleUpdateClass, handleCloseClass } = require("../controller/class");
const { HomeParentPage, HandleGetStudentOfParent, handleGetFeeParent, handleCreateFee } = require("../controller/parent");
const { HomePage, LoginPage, RegisterPage } = require("../controller/public-page");
const { HomeStudentPage, eventDetail, scheduleStudent, ClassInfomationPage } = require("../controller/student");
const { HomeTeacherPage, ClassInfomation, hanldeAttendance, ScheduleTeacher, handleTeacherSendNotification } = require("../controller/teacher");
const { handleAuthentication, handleLogout, handleRegister, handleCreateUser, handleGetInfomation, handleUpdatePersionalInfomation } = require("../controller/user");
const { handleAddEvent } = require("../services/class-service");
const { checkAuthentization, checkRole } = require("./permissions");

const initPage = (app) => {
    app.get("/", HomePage);
    app.get("/login", LoginPage);
    app.get("/logout", handleLogout);
    app.get("/register", RegisterPage);
    app.get("/error", (req, res) => {
        res.render("error-page");
    });
};

const initRouteAdmin = (app, upload) => {
    //route get home page admin
    app.post("/api/return-salary", checkAuthentization, checkRole("R0"), handleAccountant);
    //route all schedule admin
    //=> get all schedule
    app.get("/all-schedule", checkAuthentization, checkRole("R0"), handleGetAllSchedule);
    //=>  add event to calendar
    app.post("/add-event", checkAuthentization, checkRole("R0"), handleAddEvent);
    //route list class admin
    //=> get list class
    app.get("/class-management", checkAuthentization, checkRole("R0"), handleGetClass);
    //=> get detail class
    app.get("/class-detail", checkAuthentization, checkRole("R0"), handleGetClassById);
    //=> handle create class
    app.post("/create-class", checkAuthentization, checkRole("R0"), upload.single("image"), handleCreateClass);
    //=> handle update class
    app.post("/update-class", checkAuthentization, checkRole("R0"), handleUpdateClass);
    //=> handle close class
    app.get("/close-class", checkAuthentization, checkRole("R0"), handleCloseClass);

    //route user management
    app.post("/create-user", checkAuthentization, checkRole("R0"), handleCreateUser);
    app.post("/update-user", checkAuthentization, checkRole("R0"), handleUpdateUser);

    //route teacher management
    //=> get list teacher
    app.get("/teacher-management", checkAuthentization, checkRole("R0"), handleGetTeacher);
    //=> get detail teacher
    app.get("/teacher-detail", checkAuthentization, checkRole("R0"), handleGetTeacherDetail);

    //route student management
    app.get("/student-detail", checkAuthentization, checkRole("R0"), handleGetStudentDetail);

    //route analysis
    app.get("/analysis", checkAuthentization, checkRole("R0"), handleAnalysis);
    app.get("/api/analysis-student", checkAuthentization, checkRole("R0"), handleGetSeriesMonth);
    app.get("/api/fee-student", checkAuthentization, checkRole("R0"), handleGetFeeAnalysis);

    //history attendance
    app.get("/history-attendance", checkAuthentization, checkRole("R0"), handleGetHistoryAttendance);
};

const initUserRoutes = (app) => {
    app.post("/login", handleAuthentication);
    app.post("/register", handleRegister);
    app.get("/personal-information", checkAuthentization, handleGetInfomation);
    //update student infomation
    app.post("/update-profile", checkAuthentization, handleUpdatePersionalInfomation);
    //get banner
    app.get("/api/banner", handleGetBanner);
};

const initStudentRoutes = (app) => {
    app.get("/home-student", checkAuthentization, checkRole("R3"), HomeStudentPage);
    //route get home page student
    app.get("/schedule-student", checkAuthentization, checkRole("R3"), scheduleStudent);
    //route get event detail
    app.get("/event-detail", checkAuthentization, eventDetail);
    //
    app.get("/class-infomation", checkAuthentization, checkRole("R3"), ClassInfomationPage);
};

const initParentRoutes = (app) => {
    app.get("/home-parent", checkAuthentization, checkRole("R2"), HomeParentPage);
    app.get("/student-of-parent", checkAuthentization, checkRole("R2"), HandleGetStudentOfParent);
    app.get("/fee-parent", checkAuthentization, checkRole("R2"), handleGetFeeParent);
    app.post("/api/create-fee", checkAuthentization, checkRole("R2"), handleCreateFee);
};
const initTeacherRoutes = (app) => {
    app.get("/home-teacher", checkAuthentization, checkRole("R1"), HomeTeacherPage);
    app.get("/class-infomation-teacher", checkAuthentization, checkRole("R1"), ClassInfomation);
    app.post("/attendance", checkAuthentization, checkRole("R1"), hanldeAttendance);
    app.get("/schedule-teacher", checkAuthentization, checkRole("R1"), ScheduleTeacher);
    app.post("/send-gmail", handleTeacherSendNotification);
};
module.exports = { initPage, initUserRoutes, initRouteAdmin, initStudentRoutes, initParentRoutes, initTeacherRoutes };
