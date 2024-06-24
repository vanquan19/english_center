const db = require("../models");
const { eachDayOfInterval } = require("date-fns");
const { handleSendMail, handleSendMessage } = require("../util/sendmail");

const HomeTeacherPage = (req, res) => {
    res.render("teacher-home", {
        auth: req.session.isAuth.DT,
        page: "home",
    });
};

const ClassInfomation = async (req, res) => {
    const { classID } = req.query;

    const teacherID = await db.Teacher.findOne({
        where: {
            userID: req.session.isAuth.DT.id,
        },
    });
    const classInfomation = await db.Class.findAll({
        where: {
            teacherID: teacherID.id,
        },
    });

    const _class = await db.Class.findOne({
        where: {
            id: classID || classInfomation[0].id,
        },
    });
    const students = await db.Student.findAll({
        where: {
            classID: classID || classInfomation[0].id,
        },
        include: [
            {
                model: db.User,
                as: "user",
                attributes: ["id", "firstname", "lastname", "email", "phone", "address", "gender", "birthday"],
            },
        ],
        raw: true,
    });

    const classSession = await db.ClassSession.findAll({
        where: {
            classID: classID || classInfomation[0].id,
            date: {
                [db.Sequelize.Op.lte]: new Date(),
            },
        },
    });
    const numberStudied = await db.ClassSession.findAll({
        where: {
            classID: classID || classInfomation[0].id,
        },
    });

    const attendancePromises = await students.map(async (student) => {
        const sessionPromises = numberStudied.map(async (session) => {
            return db.Attendance.findOne({
                where: {
                    studentID: student.id,
                    classSessionID: session.id,
                },
                attributes: ["status"],
            });
        });
        return { student: student, listAttendance: await Promise.all(sessionPromises) };
    });

    let attendances = await Promise.all(attendancePromises);

    attendances = attendances.map((attendance) => {
        return {
            student: attendance.student,
            listAttendance: attendance.listAttendance.map((a) => (a ? a : { status: 0 })),
        };
    });

    //get chat
    const chat = await db.Notification.findAll({
        where: {
            recipientID: classID || classInfomation[0].id,
        },
    });

    const alert = { ...req.session.alert };
    req.session.alert = null;
    res.render("class-infomation-teacher", {
        auth: req.session.isAuth.DT,
        page: "class",
        classInfomation: classInfomation,
        classSession: classSession,
        alert: alert,
        students: students,
        _class: _class,
        numberStudied: numberStudied,
        attendances: attendances,
        chat: chat,
    });
};
const hanldeAttendance = async (req, res) => {
    const { students, sessionID } = req.body;

    students.forEach(async (student) => {
        await db.Attendance.create({
            studentID: student.id,
            classSessionID: sessionID,
            status: student.status,
        });

        if (student.status == 0) {
            await handleSendMail(student.id);
            console.log("send mail");
        }
    });
    await db.Teacher.update(
        {
            teached: db.Sequelize.literal("teached + 1"),
        },
        {
            where: {
                userID: req.session.isAuth.DT.id,
            },
        }
    );

    req.session.alert = {
        success: "Điểm danh thành công",
    };
    res.redirect("/class-infomation");
};

// get schedule teacher

const ScheduleTeacher = async (req, res) => {
    let { month, year } = req.query;
    //defind date default
    const today = new Date();
    let currentMonth = today.getMonth();
    let currentDate = today.getDate();
    let currentYear = today.getFullYear();
    if (month && year) {
        currentMonth = parseInt(month) - 1;
        currentYear = parseInt(year);
    }
    const teacherID = await db.Teacher.findOne({
        where: {
            userID: req.session.isAuth.DT.id,
        },
    });
    const classInfomation = await db.Class.findAll({
        where: {
            teacherID: teacherID.id,
        },
    });
    // get all session of all class
    /**
     * [
     * [{}, {}, {}],
     * [{}, {}, {}],
     * ]
     */
    let classSession = [];
    const listClassSession = [];

    for (let i = 0; i < classInfomation.length; i++) {
        const sessions = await db.ClassSession.findAll({
            where: {
                classID: classInfomation[i].id,
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
        listClassSession.push(sessions);
        classSession = [...classSession, ...sessions];
    }

    // get all day of all month
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
    while (listDayOfMonth.length < 42) {
        const lastDayOfListDay = listDayOfMonth[listDayOfMonth.length - 1].getDate();
        listDayOfMonth.push(new Date(currentYear, currentMonth + 1, lastDayOfListDay + 1));
    }

    // get all session of teacher
    const sessions = [];
    listDayOfMonth.map((item) => {
        const listSessionOfDate = [];
        classSession.map((session) => {
            if (session.date.getDate() === item.getDate() && session.date.getMonth() === item.getMonth() && session.date.getFullYear() === item.getFullYear()) {
                listSessionOfDate.push(session);
            }
        });
        if (listSessionOfDate.length > 0) {
            sessions.push(listSessionOfDate);
        } else {
            sessions.push([{ date: item, name: "Không có lịch học" }]);
        }
    });

    res.render("teacher-schedule", {
        auth: req.session.isAuth.DT,
        page: "schedule",
        listDay: sessions,
        currentDate: currentDate,
        currentMonth: currentMonth + 1,
        currentYear: currentYear,
        today: today,
        listClassSession: listClassSession,
    });
};
const handleTeacherSendNotification = async (req, res) => {
    try {
        const { classID, subject, text } = req.body;
        const students = await db.Student.findAll({
            where: {
                classID: classID,
            },
            include: [
                {
                    model: db.Parent,
                    as: "parent",
                    include: [
                        {
                            model: db.User,
                            as: "user",
                            attributes: ["id", "email", "firstname", "lastname"],
                        },
                    ],
                },
                {
                    model: db.User,
                    as: "user",
                    attributes: ["id", "firstname", "lastname"],
                },
                {
                    model: db.Class,
                    as: "classes",
                    attributes: ["name", "year"],
                },
            ],
            raw: true,
        });
        let status = false;
        students.forEach(async (student) => {
            const data = await handleSendMessage(student["parent.user.email"], subject, text);
            if (!data) {
                status = false;
                return res.json({ error: "Gửi thông báo thất bại" });
            }
            status = data;
        });
        await db.Notification.create({
            recipientID: classID,
            dateSend: new Date(),
            message: text,
            status: status ? 1 : 0,
        });
        return res.redirect("/class-infomation-teacher?classID=" + classID);
    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
};

module.exports = {
    HomeTeacherPage,
    ClassInfomation,
    hanldeAttendance,
    ScheduleTeacher,
    handleTeacherSendNotification,
};
