const { eachDayOfInterval } = require("date-fns");
const db = require("../models");

const HomeStudentPage = async (req, res) => {
    res.render("student-home", {
        page: "home",
        auth: req.session.isAuth.DT,
    });
};

const scheduleStudent = async (req, res) => {
    const { month, year } = req.query;
    //defind date default
    const today = new Date();
    let currentMonth = today.getMonth();
    let currentDate = today.getDate();
    let currentYear = today.getFullYear();

    //if clident send month and year ==> get data of that month
    if (month && year) {
        currentMonth = parseInt(month) - 1;
        currentYear = parseInt(year);
    }
    // get all date in month
    const listDayOfMonth = eachDayOfInterval({
        start: new Date(currentYear, currentMonth, 1),
        end: new Date(currentYear, currentMonth + 1, 0),
    });
    // add some day in preview month and next month
    const firstDateOfMonth = listDayOfMonth[0].getDay();
    const lastDateOfMonth = listDayOfMonth[listDayOfMonth.length - 1].getDay();
    for (let i = 0; i <= firstDateOfMonth - 1; i++) {
        listDayOfMonth.unshift(new Date(currentYear, currentMonth, 0 - i));
    }
    for (let i = 0; i < 6 - lastDateOfMonth; i++) {
        listDayOfMonth.push(new Date(currentYear, currentMonth + 1, i + 1));
    }
    // hanled get calender
    const listDayOfEvent = [];
    //get all event in database

    //get  classID

    const classID = await db.Student.findOne({
        where: {
            userID: req.session.isAuth.DT.id,
        },
        attributes: ["classID"],
    });

    const classSession = await db.ClassSession.findAll({
        where: {
            classID: classID.classID,
        },
        include: [
            {
                model: db.Class,
                as: "class",
                attributes: ["name", "year"],
            },
        ],
        raw: true,
    });

    const student = await db.Student.findOne({
        where: {
            userID: req.session.isAuth.DT.id,
        },
    });

    const numberStudied = await db.ClassSession.count({
        where: {
            classID: classID.classID,
            date: {
                [db.Sequelize.Op.lte]: new Date(),
            },
        },
    });
    const numberAbsent = await db.Attendance.count({
        where: {
            studentID: student.id,
            status: 0,
        },
    });

    const attendancePromise = classSession.map(async (session) => {
        const attendance = await db.Attendance.findOne({
            where: {
                studentID: student.id,
                classSessionID: session.id,
            },
        });

        if (attendance) {
            return {
                ...session,
                attendance: attendance.status,
            };
        } else {
            return {
                ...session,
            };
        }
    });

    const attendances = await Promise.all(attendancePromise);
    // handle get event into calendar
    listDayOfMonth.map((item) => {
        const date = item.getDate();
        const getMonth = item.getMonth();
        const year = item.getFullYear();
        const listEvent = attendances.filter((session) => {
            return session.date.getDate() === date && session.date.getMonth() === getMonth && session.date.getFullYear() === year;
        });
        if (listEvent.length > 0) {
            listDayOfEvent.push([...listEvent]);
        } else {
            listDayOfEvent.push([{ date: item, name: "Không có sự kiện" }]);
        }
    });

    // get all class
    const allClass = await db.Class.findAll({
        attributes: ["id", "name"],
    });

    //list Event of today

    res.render("shedule-student", {
        auth: req.session.isAuth.DT,
        title: "Trang chủ học sinh",
        page: "schedule",
        classSession: classSession,
        currentDate: currentDate,
        currentMonth: currentMonth + 1,
        currentYear: currentYear,
        listDay: listDayOfEvent,
        today: today,
        allClass: allClass,
        classID: classID.classID,
        numberStudied: numberStudied,
        numberAbsent: numberAbsent,
    });
};

const eventDetail = async (req, res) => {
    const { classID, date } = req.query;

    console.log(new Date(date));
    const event = await db.ClassSession.findAll({
        where: {
            classID: classID,
        },
        include: [
            {
                model: db.Class,
                as: "class",
                attributes: ["name", "year"],
            },
        ],
        raw: true,
    });
    const listEvent = event.filter((item) => {
        return item.date.getDate() === new Date(date).getDate() && item.date.getMonth() === new Date(date).getMonth() && item.date.getFullYear() === new Date(date).getFullYear();
    });
    console.log(listEvent);
    res.json(listEvent);
};

const ClassInfomationPage = async (req, res) => {
    const student = await db.Student.findOne({
        where: {
            userID: req.session.isAuth.DT.id,
        },
        include: [
            {
                model: db.Class,
                as: "classes",
                attributes: ["id", "name", "year", "startAt"],
                include: [
                    {
                        model: db.Teacher,
                        as: "teacher",
                        include: [
                            {
                                model: db.User,
                                as: "user",
                                attributes: ["firstname", "lastname", "email", "phone"],
                            },
                        ],
                    },
                ],
            },
        ],
        raw: true,
    });
    const listStudents = await db.Student.findAll({
        where: {
            classID: student["classes.id"],
        },
        include: [
            {
                model: db.User,
                as: "user",
                attributes: ["firstname", "lastname", "email", "phone", "address", "gender", "birthday"],
            },
        ],
        raw: true,
    });

    res.render("class-infomation", {
        page: "class",
        auth: req.session.isAuth.DT,
        student: student,
        students: listStudents,
    });
};

module.exports = { HomeStudentPage, eventDetail, scheduleStudent, ClassInfomationPage };
