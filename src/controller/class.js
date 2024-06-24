const { eachDayOfInterval, set } = require("date-fns");
const db = require("../models/index");
const { handleCreateBanner } = require("./banner");

// handle create class
const handleCreateClass = async (req, res) => {
    try {
        const { name, year, startAt, price, content, shift, day, endDate } = req.body;
        let image = "";
        if (req.file) {
            image = req.file.buffer.toString("base64");
        }
        const data = await db.Class.create({
            name: name,
            year: year,
            startAt: new Date(startAt),
            endAt: new Date(endDate),
            status: true,
            price: parseFloat(price),
        });
        if (image) {
            handleCreateBanner(image, content, startAt);
        }
        if (shift && day.length > 0) {
            const start = new Date(startAt);
            const end = new Date(endDate);

            if (start > end) {
                throw new Error("Start date must be before end date");
            }
            const allDays = eachDayOfInterval({
                start: start,
                end: end,
            });

            allDays.forEach(async (item) => {
                const dayOfWeek = item.getDay();
                if (day.includes(dayOfWeek.toString())) {
                    await db.ClassSession.create({
                        classID: +data.id,
                        date: item,
                        shift: shift,
                    });
                }
            });
        }
        setTimeout(() => {
            res.redirect("/class-management");
        }, 500);
    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
};

// handle get list class
const handleGetClass = async (req, res) => {
    const limit = 10;
    let { page = 1 } = req.query;
    page = parseInt(page);
    const offset = (page - 1) * limit;
    const { count, rows } = await db.Class.findAndCountAll({
        limit: limit,
        offset: offset,
        include: [
            {
                model: db.Teacher,
                as: "teacher",
                include: [
                    {
                        model: db.User,
                        as: "user",
                        attributes: ["firstname", "lastname"],
                    },
                ],
            },
        ],
        order: [
            ["createdAt", "DESC"],
            ["name", "ASC"],
            ["year", "DESC"],
        ],
        raw: true,
    });

    const listClass = await Promise.all(
        rows.map(async (item) => {
            const numStudent = await db.Student.count({
                where: {
                    classID: item.id,
                },
            });
            return { numStudent, ...item };
        })
    );

    res.render("list-class", {
        page: "class",
        _class: listClass,
        count: count,
        totalPage: Math.ceil(count / limit),
        currentPage: page,
        title: "Danh sách lớp học",
        auth: req.session.isAuth.DT,
    });
};

// handle get class detail
const handleGetClassById = async (req, res) => {
    const { id } = req.query;
    const infoClass = await db.Class.findOne({
        where: {
            id: id,
        },
        include: [
            {
                model: db.Teacher,
                as: "teacher",
                attributes: [],
                include: [
                    {
                        model: db.User,
                        as: "user",
                        attributes: ["firstname", "lastname", "email", "phone"],
                    },
                ],
            },
        ],
        raw: true,
    });
    const listStudent = await db.Student.findAll({
        where: {
            classID: +infoClass.id,
        },
        include: [
            {
                model: db.User,
                as: "user",
                attributes: ["firstname", "lastname", "email", "phone", "address", "birthday", "gender"],
            },
        ],
        raw: true,
    });

    const listTeacher = await db.Teacher.findAll({
        include: [
            {
                model: db.User,
                as: "user",
                attributes: ["firstname", "lastname"],
            },
        ],
        attributes: ["id"],
        raw: true,
    });
    const alert = { ...req.session.alert };
    req.session.alert = null;
    setTimeout(() => {
        res.render("class-detail", {
            alert: alert,
            dataClass: infoClass,
            students: listStudent,
            teachers: listTeacher,
            title: "Thông tin lớp học",
            page: "class-detail",
            auth: req.session.isAuth.DT,
        });
    }, 200);
};

// handle management celender for class - chưa xác định
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
            return session.date.getDate() === date && session.date.getMonth() === getMonth && session.date.getFullYear() === year;
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
    let infoTeacher = {};
    if (_class.teacherID) {
        const teacher = await db.Teacher.findOne({
            where: {
                id: _class.teacherID,
            },
        });
        infoTeacher = await db.User.findOne({
            where: {
                id: teacher.userID,
            },
            attributes: ["firstname", "lastname", "email", "phone", "address", "gender", "birthday"],
        });
    }
    res.render("genaral-class-infomation", {
        page: "class-management",
        dataClass: _class,
        teacher: { id: _class.teacherID, ...infoTeacher },
    });
};

// handle update class

const handleUpdateClass = async (req, res) => {
    try {
        const { id, name, year, price, teacherID } = req.body;

        await db.Class.update(
            {
                name: name,
                year: year,
                price: parseFloat(price),
                teacherID: teacherID,
            },
            {
                where: {
                    id: id,
                },
            }
        );

        req.session.alert = { success: "Cập nhật thông tin lớp học thành công!" };
        setTimeout(() => {
            res.redirect("/class-detail?id=" + id);
        }, 200);
    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
};

// handle close class
const handleCloseClass = async (req, res) => {
    try {
        const { id } = req.query;
        await db.Class.update(
            {
                status: false,
            },
            {
                where: {
                    id: id,
                },
            }
        );
        req.session.alert = { success: "Đóng lớp học thành công!" };
        setTimeout(() => {
            res.redirect("/class-detail?id=" + id);
        }, 200);
    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
};

module.exports = {
    handleCreateClass,
    handleGetClass,
    handleGetClassById,
    handleManagementCalendar,
    handleGetInfomationClass,
    handleUpdateClass,
    handleCloseClass,
};
