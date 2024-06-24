const bcrypt = require("bcrypt");
const saltRounds = 10;
const db = require("../models/index");
const { Op } = require("sequelize");

const hashPassword = async (password) => {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
};
const comparePassword = async (password, userPassword) => {
    const match = await bcrypt.compare(password, userPassword);
    if (match) {
        return true;
    } else {
        return false;
    }
};

const handleAuthentication = async (req, res) => {
    try {
        const { username, password } = req.body;
        const users = await db.User.findOne({
            where: {
                [Op.or]: [{ email: username }, { username: username }],
                deletedAt: null,
            },
        });
        if (!users) {
            req.session.alert = { usernameError: "Tài khoản không tồn tại!" };
            return res.redirect("/login");
        }
        const match = await comparePassword(password, users.password);
        if (match) {
            const { password, deletedAt, createdAt, updatedAt, username, ...userSession } = users;
            req.session.isAuth = {
                staus: true,
                DT: userSession,
            };
            await db.Session.create({
                id: req.sessionID,
                expires: new Date(req.session.cookie._expires),
                data: JSON.stringify(req.session.isAuth),
            });
            if (users.role == "R0") {
                res.redirect("/analysis");
            } else if (users.role == "R1") {
                res.redirect("/home-teacher");
            } else if (users.role == "R2") {
                res.redirect("/home-parent");
            } else if (users.role == "R3") {
                res.redirect("/home-student");
            } else {
                req.session.alert = { usernameError: "Tài khoản không tồn tại!" };
                res.redirect("/login");
            }
        } else {
            req.session.alert = { passwordError: "Mật khẩu không đúng!" };
            res.redirect("/login");
        }
    } catch (error) {
        res.redirect("/error");
        console.log(error);
    }
};

const handleLogout = async (req, res) => {
    try {
        await db.Session.destroy({
            where: {
                id: req.sessionID,
            },
        });
        req.session.destroy();
        res.redirect("/");
    } catch (error) {
        console.log(error);
        res.send("Something went wrong!");
    }
};

const handleRegister = async (req, res) => {
    try {
        const { firstname, lastname, username, password, email, phone, address } = req.body;
        if (!firstname || !lastname || !username || !password || !email || !phone) {
            res.send("Missing required field");
        }
        const hash = await hashPassword(password);
        const data = await db.User.create({
            firstname,
            lastname,
            username,
            email,
            phone,
            password: hash,
            address,
            role: "R3",
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        if (!data) {
            res.redirect("/register");
            return res.send("Something went wrong!");
        }
        res.redirect("/login");
        return res.send("Register successfully!");
    } catch (error) {
        res.redirect("/register");
        return res.send("Sthing went wrong!");
    }
};
const handleCreateUser = async (req, res) => {
    console.log(req.body);
    try {
        const { firstname, lastname, username, password, email, phone, address, gender, birthday, role, ...dataRole } = req.body;

        if (!firstname || !lastname || !username || !password || !email || !phone || !role) {
            res.send("Missing required field");
        }
        let dataResponse = {};
        const hash = await hashPassword(password);
        const userCreate = {
            firstname,
            lastname,
            username,
            email,
            phone,
            username,
            role,
            password: hash,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        if (address) userCreate.address = address;
        if (gender) userCreate.gender = +gender;
        if (birthday) userCreate.birthday = birthday;
        const data = await db.User.create(userCreate);
        if (data) {
            dataResponse = {
                id: data.id,
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
                phone: data.phone,
                role: data.role,
                address: data.address,
                gender: data.gender,
                birthday: data.birthday,
            };
            //if role == R1 => create teacher
            if (role == "R1") {
                const teacerCreate = {
                    userID: data.id,
                    teached: dataRole.teached || 0,
                };
                if (dataRole.salary) teacerCreate.salary = dataRole.salary;
                if (dataRole.paidSalaryDate) teacerCreate.paidSalaryDate = dataRole.paidSalaryDate;
                const teacher = await db.Teacher.create(teacerCreate);
                if (teacher) {
                    dataResponse.salary = teacher.salary;
                    dataResponse.teached = teacher.teached;
                    dataResponse.paidSalaryDate = teacher.paidSalaryDate;
                }
                if (dataRole.classID) {
                    await db.Class.update(
                        {
                            teacherID: teacher.id,
                        },
                        {
                            where: {
                                id: dataRole.classID,
                            },
                        }
                    );
                }
                req.session.alert = { success: "Thêm giáo viên thành thông!" };
                return res.redirect("/teacher-management");
            }
            //if role == R3 => create parent then create student role R3
            if (role == "R3") {
                //create parent
                if (!dataRole.pFirstname || !dataRole.pLastname || !dataRole.pPhone || !dataRole.pEmail || !dataRole.pPassword || !dataRole.pUsername) {
                    res.send("Missing required field");
                    res.redirect("/error");
                }
                const parentCreate = {
                    firstname: dataRole.pFirstname,
                    lastname: dataRole.pLastname,
                    phone: dataRole.pPhone,
                    email: dataRole.pEmail,
                    username: dataRole.pUsername,
                    password: await hashPassword(dataRole.pPassword),
                    role: "R2",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };

                const user = await db.User.create(parentCreate);
                const parent = await db.Parent.create({
                    userID: user.id,
                    zalo: dataRole.zalo || dataRole.pPhone,
                });
                //create student
                const studentCreate = {
                    userID: +data.id,
                    parentID: +parent.id,
                    classID: dataRole.classID || null,
                    discount: dataRole.discount || 0,
                };
                const student = await db.Student.create(studentCreate);
                if (student && parent) {
                    dataResponse.parent = {
                        id: user.id,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        phone: user.phone,
                        email: user.email,
                        address: user.address,
                        gender: user.gender,
                        birthday: user.birthday,
                        role: user.role,
                        zalo: parent.zalo,
                    };
                }
                req.session.alert = { success: "Thêm học sinh thành công!" };
                return res.redirect("/class-detail?id=" + dataRole.classID);
            }

            return res.redirect("/");
        }
    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
};
const handleGetInfomation = async (req, res) => {
    try {
        const user = await db.User.findOne({
            where: {
                id: req.session.isAuth.DT.id,
            },
        });
        if (!user) {
            res.redirect("/login");
        }
        let alert = { ...req.session.alert };
        req.session.alert = null;
        if (user.role == "R0") {
            return res.render("persional-infomation-admin", { auth: user, page: "personal-information", title: "Thông tin quản trị viên", alert: alert });
        }
        if (user.role == "R1") {
            const teacher = await db.Teacher.findOne({
                where: {
                    userID: user.id,
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

            return res.render("persional-infomation-teacher", { auth: user, teacher: teacher, page: "personal-information", tittle: "Thông tin giáo viên", alert: alert });
        }
        if (user.role == "R2") {
            return res.render("persional-infomation-parent", { auth: user, page: "personal-information", tittle: "Thông tin phụ huynh", alert: alert });
        }
        if (user.role == "R3") {
            const student = await db.Student.findOne({
                where: {
                    userID: user.id,
                },
                include: [
                    {
                        model: db.Parent,
                        as: "parent",
                        include: [
                            {
                                model: db.User,
                                as: "user",
                                attributes: ["firstname", "lastname", "email", "phone", "address", "birthday"],
                            },
                        ],
                    },
                    {
                        model: db.Class,
                        as: "classes",
                        attributes: ["name", "year"],
                    },
                ],
                raw: true,
            });

            res.render("persional-infomation-student", { auth: user, page: "personal-information", tittle: "Thông tin học sinh", student: student, alert: alert });
        }
    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
};

//update user
const handleUpdatePersionalInfomation = async (req, res) => {
    try {
        //get data from client
        const { id, role, firstname, lastname, email, phone, username, birthday, address, gender } = req.body;
        //init data to update for user table
        const dataUser = {};
        console.log(id, role, firstname, lastname, email, phone, username, birthday, address, gender);
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
            await db.User.update(dataUser, {
                where: {
                    id: id,
                },
            });
            req.session.alert = { success: "Cập nhật thông tin thành công!" };
            //if role is teacher
            if (role === "R1") {
                return res.redirect("/personal-information-teacher");
            }
            //if role is student
            else if (role === "R3") {
                return res.redirect("/personal-information?id=" + id);
            }
            //if role is parent
            else if (role === "R2") {
                return res.redirect("/personal-information?id=" + id);
            } else if (role === "R0") {
                return res.redirect("/personal-information?id=" + id);
            }
        }
    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
};

module.exports = {
    handleAuthentication,
    handleLogout,
    hashPassword,
    handleRegister,
    handleCreateUser,
    handleGetInfomation,
    handleUpdatePersionalInfomation,
};
