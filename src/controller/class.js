const { eachDayOfInterval } = require("date-fns");
const db = require("../models/index");
const { handleCreateBanner } = require("./banner");
const { handleAddEvent } = require("../services/class-service");
const handleCreateClass = async (req, res) => {
    try {
        const { name, year, startAt, price, content, shift, day, endDate } =
            req.body;
        let image = "";
        if (req.file) {
            image = req.file.buffer.toString("base64");
        }
        const data = await db.Class.create({
            name: name,
            year: year,
            startAt: new Date(startAt),
            status: true,
            price: parseFloat(price),
        });
        if (image) {
            handleCreateBanner(image, content, startAt);
        }
        if (shift && day.length > 0) {
            await handleAddEvent(data.id, day, shift, startAt, endDate);
        }
        setTimeout(() => {
            res.redirect("/class-management/1");
        }, 500);
    } catch (error) {
        console.log(error);
        res.redirect("/create-class");
    }
};

const handleGetClass = async (req, res) => {
    const limit = 7;
    const page = req.params.page || 1;
    const offset = (page - 1) * limit;
    const { count, rows } = await db.Class.findAndCountAll({
        limit: limit,
        offset: offset,
    });
    res.render("class-management", {
        page: "class-management",
        _class: rows,
        count: count,
        totalPage: Math.ceil(count / limit),
        currentPage: page,
    });
};

const handleGetClassById = async (req, res) => {
    const { id } = req.params;
    const data = await db.Class.findOne({
        where: {
            id: id,
        },
    });
    const students = await db.Student.findAll({
        where: {
            classID: data.id,
        },
    });
    const listStudentPromises = students.map(async (item, index) => {
        const student = await db.User.findOne({
            where: {
                id: item.userID,
            },
            attributes: [
                "firstname",
                "lastname",
                "email",
                "phone",
                "address",
                "gender",
                "birthday",
            ],
        });
        return { id: item.id, ...student };
    });
    const listStudent = await Promise.all(listStudentPromises);
    setTimeout(() => {
        res.render("class-detail", {
            dataClass: data,
            students: listStudent,
            page: "class-management",
        });
    }, 500);
};

// handle management celender for class
const handleManagementCalendar = async (req, res) => {
    const { id, month, year } = req.query;
    const data = await db.Class.findOne({
        where: {
            id: id,
        },
    });
    const classSession = await db.ClassSession.findAll({
        where: {
            classID: id,
        },
    });
    const today = new Date();
    let currentMonth = today.getMonth();
    let currentDate = today.getDate();
    let currentYear = today.getFullYear();
    if (month && year) {
        currentMonth = parseInt(month) - 1;
        currentYear = parseInt(year);
    }

    const listDayOfMonth = eachDayOfInterval({
        start: new Date(currentYear, currentMonth, 1),
        end: new Date(currentYear, currentMonth + 1, 0),
    });
    const firstDateOfMonth = listDayOfMonth[0].getDay();
    const lastDateOfMonth = listDayOfMonth[listDayOfMonth.length - 1].getDay();
    for (let i = 0; i <= firstDateOfMonth - 1; i++) {
        listDayOfMonth.unshift(new Date(currentYear, currentMonth, 0 - i));
    }
    for (let i = 0; i < 6 - lastDateOfMonth; i++) {
        listDayOfMonth.push(new Date(currentYear, currentMonth + 1, i + 1));
    }
    const listDayOfEvent = [];
    listDayOfMonth.map((item) => {
        const date = item.getDate();
        const getMonth = item.getMonth();
        const year = item.getFullYear();
        const listEvent = classSession.filter((session) => {
            return (
                session.date.getDate() === date &&
                session.date.getMonth() === getMonth &&
                session.date.getFullYear() === year
            );
        });
        if (listEvent.length > 0) {
            listDayOfEvent.push(...listEvent);
        } else {
            listDayOfEvent.push({ date: item });
        }
    });

    setTimeout(() => {
        res.render("classCelender", {
            dataClass: data,
            page: "class-management",
            currentDate: currentDate,
            currentMonth: currentMonth + 1,
            currentYear: currentYear,
            listDay: listDayOfEvent,
            today: today,
        });
    }, 500);
};

const handleGetInfomationClass = async (req, res) => {
    const { id } = req.params;
    const _class = await db.Class.findOne({
        where: {
            id: id,
        },
    });
    const teacher = await db.Teacher.findOne({
        where: {
            id: _class.teacherID,
        },
    });
    const teacherInfo = await db.User.findOne({
        where: {
            id: teacher.userID,
        },
        attributes: [
            "firstname",
            "lastname",
            "email",
            "phone",
            "address",
            "gender",
            "birthday",
        ],
    });

    res.render("genaral-class-infomation", {
        page: "class-management",
        dataClass: _class,
        teacher: teacherInfo,
    });
};

module.exports = {
    handleCreateClass,
    handleGetClass,
    handleGetClassById,
    handleManagementCalendar,
    handleGetInfomationClass,
};
