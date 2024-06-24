const db = require("../models");
const { handleSendFeeMail } = require("../util/sendmail");

const HomeParentPage = (req, res) => {
    res.render("parent-home", {
        page: "home",
        auth: req.session.isAuth.DT,
    });
};
const HandleGetStudentOfParent = async (req, res) => {
    const parent = await db.Parent.findOne({
        where: {
            userID: req.session.isAuth.DT.id,
        },
    });

    const students = await db.Student.findAll({
        where: {
            parentID: parent.id,
        },
        include: [
            {
                model: db.User,
                as: "user",
                attributes: ["id", "firstname", "lastname", "email", "phone", "address", "gender", "birthday"],
            },
            {
                model: db.Class,
                as: "classes",
                attributes: ["id", "name", "year"],
                include: [
                    {
                        model: db.Teacher,
                        as: "teacher",
                        include: [
                            {
                                model: db.User,
                                as: "user",
                                attributes: ["id", "firstname", "lastname", "email", "phone"],
                            },
                        ],
                    },
                ],
            },
        ],
        raw: true,
    });

    const classSession = await Promise.all(
        students.map(async (student) => {
            const session = await db.ClassSession.findAll({
                where: {
                    classID: student["classes.id"],
                },
                raw: true,
            });
            return {
                student: student,
                session: session,
            };
        })
    );
    //get attendance
    await Promise.all(
        students.map(async (student, index) => {
            const attendance = await db.Attendance.findAll({
                where: {
                    studentID: student.id,
                },
                include: [
                    {
                        model: db.ClassSession,
                        as: "classSession",
                        attributes: ["date", "shift"],
                    },
                ],

                raw: true,
            });
            classSession[index].attendance = attendance;
        })
    );

    await Promise.all(
        classSession.map(async (session) => {
            const absent = session.attendance.filter((att) => att.status === 0);
            classSession.numberAbsent = absent.length;
        })
    );

    console.log(classSession);
    const alert = { ...req.session.alert };
    req.session.alert = null;
    res.render("student-of-parent", {
        auth: req.session.isAuth.DT,
        title: "Trang chủ học sinh",
        page: "student",
        alert: alert,
        classSession: classSession,
    });
};

const handleGetFeeParent = async (req, res) => {
    const parent = await db.Parent.findOne({
        where: {
            userID: req.session.isAuth.DT.id,
        },
    });

    const students = await db.Student.findAll({
        where: {
            parentID: parent.id,
        },
        include: [
            {
                model: db.User,
                as: "user",
                attributes: ["id", "firstname", "lastname", "email", "phone", "address", "gender", "birthday"],
            },
            {
                model: db.Class,
                as: "classes",
                attributes: ["id", "name", "year", "price"],
            },
        ],
        raw: true,
    });
    const allFees = await Promise.all(
        students.map(async (student, index) => {
            //fee paid
            const feePaids = await db.Fee.findAll({
                where: {
                    studentID: student.id,
                },
                raw: true,
            });
            //session by month and year
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
                where: {
                    classID: student["classes.id"],
                },
                group: [db.sequelize.fn("YEAR", db.sequelize.col("date")), db.sequelize.fn("MONTH", db.sequelize.col("date"))],
                order: [
                    [db.sequelize.fn("YEAR", db.sequelize.col("date")), "ASC"],
                    [db.sequelize.fn("MONTH", db.sequelize.col("date")), "ASC"],
                ],
                raw: true,
            });
            //remove object exist in feePaid
            const sessionNotPaid = [];

            //if paid < fee => push to sessionNotPaid

            feePaids.map((feePaid) => {
                const listFeeinmonth = feePaids.filter((fee) => {
                    return fee.monthOfYear == feePaid.monthOfYear && fee.year == feePaid.year;
                });
                const totalFee = listFeeinmonth.reduce((acc, fee) => {
                    return acc + fee.paid;
                }, 0);
                if (totalFee < feePaid.fee) {
                    sessionNotPaid.push({
                        month: feePaid.monthOfYear,
                        year: feePaid.year,
                        count: 1,
                        "class.price": feePaid.fee - totalFee,
                    });
                }
            });
            //if not exist in feePaid => push to sessionNotPaid
            sessions.map((session) => {
                if (
                    !feePaids.some((feePaid) => {
                        return feePaid.monthOfYear == session.month && feePaid.year == session.year;
                    })
                ) {
                    sessionNotPaid.push(session);
                }
            });
            const sumFee = sessions.reduce((acc, fee) => {
                return acc + fee["class.price"] * fee.count;
            }, 0);
            const sumPaid = feePaids.reduce((acc, fee) => {
                return acc + fee.paid;
            }, 0);
            const sumFeeNotPaid = sessionNotPaid.reduce((acc, fee) => {
                return acc + fee["class.price"] * fee.count;
            }, 0);

            return {
                student: student,
                feeNotPaid: sessionNotPaid,
                feePaid: feePaids,
                listFeeOfMonth: sessions,
                sumFee: sumFee,
                sumPaid: sumPaid,
                sumFeeNotPaid: sumFeeNotPaid,
            };
        })
    );
    const alert = { ...req.session.alert };
    req.session.alert = null;
    res.render("fee-of-parent", {
        auth: req.session.isAuth.DT,
        title: "Trang chủ học sinh",
        page: "fee",
        alert: alert,
        fees: allFees,
    });
};
const handleCreateFee = async (req, res) => {
    try {
        let { studentID, data, cash } = req.body;
        cash = parseFloat(cash);
        const student = await db.Student.findOne({
            where: {
                id: +studentID,
            },
            attributes: ["id", "discount"],
            include: [
                {
                    model: db.Class,
                    as: "classes",
                    attributes: ["price"],
                },
            ],
            raw: true,
        });
        data.forEach(async (fee) => {
            fee.cash = parseFloat(fee.cash);
            let realPaid = fee.cash;
            if (cash <= fee.cash) {
                realPaid = cash;
            }
            cash = cash - realPaid;
            await db.Fee.create({
                studentID: +studentID,
                monthOfYear: fee.month,
                year: fee.year,
                fee: fee.cash,
                paid: realPaid,
                paidDate: new Date(),
            });
        });
        await handleSendFeeMail(studentID);
        res.json({ status: "ok" });
    } catch (error) {
        console.log(error);
        res.json({ status: "error" });
    }
};

module.exports = { HomeParentPage, HandleGetStudentOfParent, handleGetFeeParent, handleCreateFee };
