const db = require("../models");
const { eachDayOfInterval, set } = require("date-fns");

const LIMIT = 7;

//home admin
const handleAccountant = async (req, res) => {
    const { teacherID, salary } = req.body;
    await db.Salary.create({
        salary: salary,
        teacherID: teacherID,
        paidDate: new Date(),
    });
    await db.Teacher.update(
        {
            teached: 0,
        },
        {
            where: {
                id: teacherID,
            },
        }
    );
    req.session.alert = {
        success: "Thanh toán lương thành công",
    };
    res.status(200).json({
        success: "ok",
    });
};

//chưa định nghĩa
const handleGetStudent = async (req, res) => {
    const { page } = req.query;
    const offset = page ? (page - 1) * LIMIT : 0;
    try {
        const { count, rows } = await db.Student.findAndCountAll({
            include: [
                {
                    model: db.User,
                    as: "user",
                    where: {
                        role: "R3",
                        deletedAt: null,
                    },
                    attributes: ["firstname", "lastname", "email", "phone", "address", "gender", "birthday"],
                },
                {
                    model: db.Class,
                    as: "classes",
                    attributes: ["name"],
                },
            ],
            attributes: ["id"],
            raw: true,
            limit: LIMIT,
            offset: offset,
        });

        res.render("student", {
            page: "student",
            listStudent: rows,
            count: count,
            totalPage: Math.ceil(count / LIMIT),
            currentPage: page,
        });
    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
};

//get all teacher
const handleGetTeacher = async (req, res) => {
    let { page = 1 } = req.query;
    page = parseInt(page);
    const offset = page ? (page - 1) * LIMIT : 0;
    try {
        const { count, rows } = await db.Teacher.findAndCountAll({
            include: [
                {
                    model: db.User,
                    as: "user",
                    where: {
                        role: "R1",
                        deletedAt: null,
                    },
                    order: [["createdAt", "DESC"]],
                    attributes: ["firstname", "lastname", "email", "phone", "address", "gender", "birthday"],
                },
            ],
            attributes: ["id", "salary", "teached"],
            raw: true,
            limit: LIMIT,
            offset: offset,
        });

        const listTeacher = await Promise.all(
            rows.map(async (item) => {
                const classOfTeacher = await db.Class.findAll({
                    where: {
                        teacherID: item.id,
                    },
                    attributes: ["name"],
                });
                return { ...item, listClass: classOfTeacher };
            })
        );

        const listClass = await db.Class.findAll({
            attributes: ["id", "name", "year"],
            where: {
                teacherID: null,
            },
        });
        const alert = { ...req.session.alert };
        req.session.alert = null;
        res.render("list-teacher", {
            alert: alert,
            page: "teacher",
            listTeacher: listTeacher,
            listClass: listClass,
            count: count,
            totalPage: Math.ceil(count / LIMIT),
            currentPage: page,
            title: "Quản lý giáo viên",
            auth: req.session.isAuth.DT,
        });
    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
};

//admin get student detail
const handleGetStudentDetail = async (req, res) => {
    const { id } = req.query;
    try {
        const student = await db.Student.findOne({
            where: {
                id: id,
            },
            attributes: ["id"],
            raw: true,
            include: [
                {
                    model: db.User,
                    as: "user",
                    attributes: ["firstname", "lastname", "email", "phone", "address", "gender", "birthday"],
                },
                {
                    model: db.Class,
                    as: "classes",
                    attributes: ["id", "name", "year"],
                },
                {
                    model: db.Parent,
                    as: "parent",
                    include: [
                        {
                            model: db.User,
                            as: "user",
                            attributes: ["firstname", "lastname", "email", "phone", "address", "gender", "birthday"],
                        },
                    ],
                },
            ],
        });
        const listClass = await db.Class.findAll();

        const feeOfStudent = {
            fee: "chưa có dữ liệu",
            paid: "chưa có dữ liệu",
            owed: "chưa có dữ liệu",
            outDate: "chưa có dữ liệu",
        };

        const alert = { ...req.session.alert };
        req.session.alert = null;

        res.render("student-detail", {
            alert: alert,
            page: "student",
            student: student,
            listClass: listClass,
            title: "Thông tin học sinh",
            auth: req.session.isAuth.DT,
            fee: feeOfStudent,
        });
    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
};

//admin get teacher detail
const handleGetTeacherDetail = async (req, res) => {
    const { id } = req.query;
    try {
        const teacher = await db.Teacher.findOne({
            where: {
                id: id,
            },
            attributes: ["id", "salary", "teached"],
            raw: true,
            include: [
                {
                    model: db.User,
                    as: "user",
                    attributes: ["firstname", "lastname", "email", "phone", "address", "gender", "birthday"],
                },
            ],
        });

        const listClass = await db.Class.findAll({
            where: {
                teacherID: null,
            },
            attributes: ["id", "name", "year"],
        });
        const classOfTeacher = (await db.Class.findOne({
            where: {
                teacherID: id,
            },
            attributes: ["id", "name", "year"],
        })) || { id: "", name: "Chưa có dữ liệu", year: "" };

        const alert = { ...req.session.alert };
        req.session.alert = null;
        res.render("teacher-detail", {
            alert: alert,
            page: "teacher-detail",
            title: "Thông tin giáo viên",
            teacher: teacher,
            listClass: [classOfTeacher, ...listClass],
            classOfTeacher: classOfTeacher,
            auth: req.session.isAuth.DT,
        });
    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
};

//get all schedule
const handleGetAllSchedule = async (req, res) => {
    try {
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
        const classSession = await db.ClassSession.findAll({
            include: [
                {
                    model: db.Class,
                    as: "class",
                    attributes: ["name"],
                },
            ],
            raw: true,
        });
        // handle get event into calendar
        listDayOfMonth.map((item) => {
            const date = item.getDate();
            const getMonth = item.getMonth();
            const year = item.getFullYear();
            const listEvent = classSession.filter((session) => {
                return session.date.getDate() === date && session.date.getMonth() === getMonth && session.date.getFullYear() === year;
            });
            if (listEvent.length > 0) {
                listDayOfEvent.push([...listEvent]);
            } else {
                listDayOfEvent.push([{ date: item }]);
            }
        });

        // get all class
        const allClass = await db.Class.findAll({
            attributes: ["id", "name"],
        });

        // render file all-schedule in view

        setTimeout(() => {
            res.render("all-schedule", {
                page: "schedule",
                currentDate: currentDate,
                currentMonth: currentMonth + 1,
                currentYear: currentYear,
                listDay: listDayOfEvent,
                today: today,
                allClass: allClass,
                title: "Lịch học",
                auth: req.session.isAuth.DT,
            });
        }, 500);
    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
};

//update user
const handleUpdateUser = async (req, res) => {
    try {
        //get data from client
        const { id, role, firstname, lastname, email, phone, username, birthday, address, gender, ...datarole } = req.body;
        //init data to update for user table
        const dataUser = {};
        //check role of user
        if (id && role) {
            //import data form client to data update for user table
            if (firstname) dataUser.firstname = firstname;
            if (lastname) dataUser.lastname = lastname;
            if (email) dataUser.email = email;
            if (phone) dataUser.phone = phone;
            if (username) dataUser.username = username;
            if (birthday) dataUser.birthday = birthday;
            if (address) dataUser.address = address;
            if (gender) dataUser.gender = gender;
            //init data update for role table
            const dataUpdate = {};
            //if role is teacher
            if (role === "R1") {
                //import data from client to data update for teacher table
                if (datarole.salary) dataUpdate.salary = datarole.salary;
                if (datarole.teached) dataUpdate.teached = datarole.teached;
                //update data for teacher table
                await db.Teacher.update(dataUpdate, {
                    where: {
                        id: +id,
                    },
                });
                //update data for user table
                const userID = await db.Teacher.findOne({
                    where: {
                        id: +id,
                    },
                    attributes: ["userID"],
                });
                await db.User.update(dataUser, {
                    where: {
                        id: +userID.userID,
                    },
                });
                //change class for teacher
                //=>remove teacher for old class
                await db.Class.update({ teacherID: null }, { where: { teacherID: +id } });
                //=>add teacher for new class
                await db.Class.update({ teacherID: id }, { where: { id: datarole.classID } });

                //back role teacher detail
                req.session.alert = { success: "Cập nhật thông tin giáo viên thành công" };
                return res.redirect("/teacher-detail?id=" + id);
            }
            //if role is student
            else if (role === "R3") {
                if (datarole.classID) {
                    //update data for student table
                    await db.Student.update({ classID: datarole.classID }, { where: { id: +id } });
                }
                //update data for user table
                const userID = await db.Student.findOne({
                    where: {
                        id: +id,
                    },
                    attributes: ["userID"],
                });
                await db.User.update(dataUser, {
                    where: {
                        id: +userID.userID,
                    },
                });
                //back role student detail
                req.session.alert = { success: "Cập nhật thông tin học sinh thành công" };
                return res.redirect("/student-detail?id=" + id);
            }
            //if role is parent
            else if (role === "R2") {
                //update data for parent table

                //update data for user table
                const userID = await db.Parent.findOne({
                    where: {
                        id: +id,
                    },
                    attributes: ["userID"],
                });
                await db.User.update(dataUser, {
                    where: {
                        id: +userID.userID,
                    },
                });
                //back role parent detail
                req.session.alert = { success: "Cập nhật thông tin phụ huynh thành công" };
                return res.redirect("/student-detail?id=" + id);
            } else {
                req.session.alert = { error: "Cập nhật thông tin không thành công" };
                return res.redirect("/teacher-detail?id=" + id);
            }
        }
    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
};

const handleUpdateFeeForStudent = async (req, res) => {};

//analysis
const handleAnalysis = async (req, res) => {
    res.render("analysis", { page: "analysis", title: "Thống kê", auth: req.session.isAuth.DT });
};

//get series month
const handleGetSeriesMonth = async (req, res) => {
    try {
        const listStudent = await db.User.findAll({
            where: {
                role: "R3",
            },
            attributes: ["createdAt", "id"],
            raw: true,
        });
        const January = listStudent.filter((item) => {
            return item.createdAt.getMonth() === 0;
        });
        const February = listStudent.filter((item) => {
            return item.createdAt.getMonth() === 1;
        });
        const March = listStudent.filter((item) => {
            return item.createdAt.getMonth() === 2;
        });
        const April = listStudent.filter((item) => {
            return item.createdAt.getMonth() === 3;
        });
        const May = listStudent.filter((item) => {
            return item.createdAt.getMonth() === 4;
        });
        const June = listStudent.filter((item) => {
            return item.createdAt.getMonth() === 5;
        });
        const July = listStudent.filter((item) => {
            return item.createdAt.getMonth() === 6;
        });
        const August = listStudent.filter((item) => {
            return item.createdAt.getMonth() === 7;
        });
        const September = listStudent.filter((item) => {
            return item.createdAt.getMonth() === 8;
        });
        const October = listStudent.filter((item) => {
            return item.createdAt.getMonth() === 9;
        });
        const November = listStudent.filter((item) => {
            return item.createdAt.getMonth() === 10;
        });
        const December = listStudent.filter((item) => {
            return item.createdAt.getMonth() === 11;
        });
        const list = [
            January.length,
            February.length,
            March.length,
            April.length,
            May.length,
            June.length,
            July.length,
            August.length,
            September.length,
            October.length,
            November.length,
            December.length,
        ];
        res.json(list);
    } catch (error) {}
};

const handleGetHistoryAttendance = async (req, res) => {
    res.render("history-attendance", { page: "history-attendance", title: "Lịch sử điểm danh", auth: req.session.isAuth.DT, listAttendance: listAttendance });
};
const handleGetFeeAnalysis = async (req, res) => {
    try {
        //analysis follow month
        //get paid fee
        const feePaid = await db.Fee.findAll({
            attributes: [
                [db.Sequelize.fn("SUM", db.Sequelize.col("paid")), "totalPaid"], // Tính tổng tiền đã thanh toán
                "monthOfYear",
                "year",
            ],
            group: ["year", "monthOfYear"],
            order: [
                ["year", "ASC"],
                ["monthOfYear", "ASC"],
            ],
        });
        //create series for chart
        const seriesFeePaid = [];
        for (let index = 0; index < 12; index++) {
            if (feePaid.some((item) => item.monthOfYear == index + 1)) {
                seriesFeePaid.push({ x: "T" + (index + 1), y: feePaid.find((item) => item.monthOfYear == index + 1).totalPaid });
            } else {
                seriesFeePaid.push({ x: "T" + (index + 1), y: 0 });
            }
        }
        //get all fee
        const seriesFee = [];
        const sessions = await db.ClassSession.findAll({
            attributes: [
                [db.sequelize.fn("YEAR", db.sequelize.col("date")), "year"],
                [db.sequelize.fn("MONTH", db.sequelize.col("date")), "month"],
                [db.sequelize.fn("COUNT", db.sequelize.col("*")), "count"], // Thêm một trường để đếm số lượng
            ],
            include: [
                {
                    model: db.Class,
                    as: "class",
                    attributes: ["price"],
                },
            ],
            group: [db.sequelize.fn("YEAR", db.sequelize.col("date")), db.sequelize.fn("MONTH", db.sequelize.col("date"))],
            order: [
                [db.sequelize.fn("YEAR", db.sequelize.col("date")), "ASC"],
                [db.sequelize.fn("MONTH", db.sequelize.col("date")), "ASC"],
            ],
            raw: true,
        });
        for (let index = 0; index < 12; index++) {
            if (sessions.some((item) => item.month == index + 1)) {
                seriesFee.push({ x: "T" + (index + 1), y: sessions.find((item) => item.month == index + 1).count * sessions.find((item) => item.month == index + 1)["class.price"] });
            } else {
                seriesFee.push({ x: "T" + (index + 1), y: 0 });
            }
        }
        // salary of teacher

        //analysis follow period
        //get all fee
        const allFeeOfPeriod = [];
        for (let index = 0; index < 12; index += 3) {
            const sum = seriesFee[index].y + seriesFee[index + 1].y + seriesFee[index + 2].y;
            allFeeOfPeriod.push({ x: "Quý " + (index / 3 + 1), y: sum });
        }
        //get paid fee
        const feePaidPeriod = [];
        for (let index = 0; index < 12; index += 3) {
            const sum = seriesFeePaid[index].y + seriesFeePaid[index + 1].y + seriesFeePaid[index + 2].y;
            feePaidPeriod.push({ x: "Quý " + (index / 3 + 1), y: sum });
        }

        //get salary teacher follow month
        const seriesSalaryFollowMonth = [];
        const salarys = await db.Salary.findAll({
            attributes: [
                [db.sequelize.fn("YEAR", db.sequelize.col("paidDate")), "year"],
                [db.sequelize.fn("MONTH", db.sequelize.col("paidDate")), "month"],
                [db.sequelize.fn("SUM", db.sequelize.col("salary")), "total"],
            ],
            group: [db.sequelize.fn("YEAR", db.sequelize.col("paidDate")), db.sequelize.fn("MONTH", db.sequelize.col("paidDate"))],
            order: [
                [db.sequelize.fn("YEAR", db.sequelize.col("paidDate")), "ASC"],
                [db.sequelize.fn("MONTH", db.sequelize.col("paidDate")), "ASC"],
            ],
        });
        for (let index = 0; index < 12; index++) {
            if (salarys.some((item) => item.month == index + 1)) {
                seriesSalaryFollowMonth.push({ x: "T" + (index + 1), y: salarys.find((item) => item.month == index + 1).total });
            } else {
                seriesSalaryFollowMonth.push({ x: "T" + (index + 1), y: 0 });
            }
        }
        //get salary teacher follow period
        const seriesSalaryFollowPeriod = [];
        for (let index = 0; index < 12; index += 3) {
            const sum = seriesSalaryFollowMonth[index].y + seriesSalaryFollowMonth[index + 1].y + seriesSalaryFollowMonth[index + 2].y;
            seriesSalaryFollowPeriod.push({ x: "Quý " + (index / 3 + 1), y: sum });
        }
        //send data to client
        res.status(200).json({
            seriesFeePaid: seriesFeePaid,
            seriesFee: seriesFee,
            seriesSalaryFollowMonth: seriesSalaryFollowMonth,
            allFeeOfPeriod: allFeeOfPeriod,
            feePaidPeriod: feePaidPeriod,
            seriesSalaryFollowPeriod: seriesSalaryFollowPeriod,
        });
    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
};
module.exports = {
    handleAccountant,
    handleGetStudent,
    handleGetTeacher,
    handleGetStudentDetail,
    handleGetTeacherDetail,
    handleGetAllSchedule,
    handleUpdateUser,
    handleAnalysis,
    handleUpdateFeeForStudent,
    handleGetSeriesMonth,
    handleGetHistoryAttendance,
    handleGetFeeAnalysis,
};
