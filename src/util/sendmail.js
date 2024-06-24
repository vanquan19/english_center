const db = require("../models/index.js");
const sendMail = require("../config/send-mailer.js");

const autoSendMail = async () => {
    const listStudent = db.Student.findAll({
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
                as: "class",
                attributes: ["id", "price", "endAt"],
            },
        ],
        raw: true,
    });
    listStudent.forEach(async (student) => {
        const absent = await db.Attendance.count({
            where: { studentID: student.id, status: 0 },
        });
        const session = await db.ClassSession.count({
            where: { classID: student.classID },
        });
        const fee = await db.Fees.findAll({
            where: { studentID: student.id },
            attributes: ["paid"],
        });
        const feeNotPaid = (session * student["classes.price"] * (100 - student.discount)) / 100 - fee.reduce((acc, cur) => acc + cur.paid, 0);

        const email = student["parent.user.email"];
        const subject = `Thông báo lớp học`;
        const text = `
            Xin chào ông bà ${student["parent.user.firstname"] + " " + student["parent.user.lastname"]}

            Chúng tôi xin thông báo rằng học sinh ${student["user.firstname"] + " " + student["user.lastname"]} đã nghỉ ${absent} buổi trên tổng số ${session} buổi học.
            Học còn nợ là ${feeNotPaid} VND, vui lòng hoàn thành học phí trước ngày ${
            student["classes.endAt"].getDate() + "/" + student["classes.endAt"].getMonth() + "/" + student["classes.endAt"].getFullYear()
        } 

            Vui lòng liên hệ với trường để biết thêm thông tin chi tiết.

            Xin cảm ơn
        `;
        await sendMail(email, subject, text);
    });
};

const handleSendMail = async (studentID) => {
    const student = await db.Student.findOne({
        where: { id: studentID },
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
        ],
        raw: true,
    });
    const email = student["parent.user.email"];
    console.log(email);
    const subject = `Thông báo lớp học`;
    const text = `
        Xin chào ông bà ${student["parent.user.firstname"] + " " + student["parent.user.lastname"]}

        Chúng tôi xin thông báo rằng học sinh ${student["user.firstname"] + " " + student["user.lastname"]} đã nghỉ học buổi hôm nay ngày ${
        new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear()
    }

        Vui lòng liên hệ với trường để biết thêm thông tin chi tiết.

        Xin cảm ơn
    `;
    await sendMail(email, subject, text);
    console.log("Send mail to ", email, " successfully");
};

const handleSendFeeMail = async (studentID) => {
    const student = await db.Student.findOne({
        where: { id: studentID },
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
        ],
        raw: true,
    });
    const email = student["parent.user.email"];
    const subject = `Thông báo lớp học`;
    const text = `
        Xin chào ông bà ${student["parent.user.firstname"] + " " + student["parent.user.lastname"]}

        Chúng tôi xin thông ông bà đã đóng thành công cho học viên ${student["user.firstname"] + " " + student["user.lastname"]} vào ngày ${
        new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear()
    } Vui lòng đăng nhập vào hệ thống để kiểm tra thông tin chi tiết.

        Vui lòng liên hệ với trường để biết thêm thông tin chi tiết.

        Xin cảm ơn
    `;
    await sendMail(email, subject, text);
    console.log("Send mail to ", email, " successfully");
};

const handleSendMessage = async (email, subject, text) => {
    const data = await sendMail(email, subject, text);
    if (data.accepted.length > 0) {
        console.log("Send mail to ", email, " successfully");
        return true;
    }
    console.log("Send mail to ", email, " failed");
    return false;
};

module.exports = {
    autoSendMail,
    handleSendMail,
    handleSendFeeMail,
    handleSendMessage,
};
