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
const checkAuthentization = async (req, res, next) => {
    try {
        const data = await db.Session.findOne({
            where: {
                id: req.sessionID,
            },
        });
        if (data) {
            next();
        } else {
            res.redirect("/login");
        }
    } catch (error) {
        console.log(error);
        res.send("Something went wrong!");
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
            res.send("User not found!");
        }
        const match = await comparePassword(password, users.password);
        if (match) {
            req.session.isAuth = {
                staus: true,
                DT: users,
            };
            await db.Session.create({
                id: req.sessionID,
                expires: new Date(req.session.cookie._expires),
                data: JSON.stringify(req.session.isAuth),
            });
            if (users.role == "R0") {
                res.redirect("/admin");
            } else if (users.role == "R1") {
                res.redirect("/teacher");
            } else if (users.role == "R2") {
                res.redirect("/parent");
            } else if (users.role == "R3") {
                res.redirect("/student");
            } else {
                res.send("Role not found!");
            }
        } else {
            res.redirect("/login");
        }
    } catch (error) {
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
const handleCreateeUser = async (req, res) => {
    try {
        const {
            firstname,
            lastname,
            username,
            password,
            email,
            phone,
            address,
            gender,
            birthday,
            role,
            ...dataRole
        } = req.body;
        if (
            !firstname ||
            !lastname ||
            !username ||
            !password ||
            !email ||
            !phone ||
            !role
        ) {
            res.send("Missing required field");
        }
        const dataResponse = {};
        const hash = await hashPassword(password);
        const userCreate = {
            firstname,
            lastname,
            username,
            email,
            phone,
            role,
            password: hash,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        if (address) userCreate.address = address;
        if (gender) userCreate.gender = gender;
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
                };
                if (dataRole.salary) teacerCreate.salary = dataRole.salary;
                if (dataRole.teached) teacerCreate.teached = dataRole.teached;
                if (dataRole.paidSalaryDate)
                    teacerCreate.paidSalaryDate = dataRole.paidSalaryDate;
                const teacher = await db.Teacher.create(teacerCreate);
                if (teacher) {
                    dataResponse.salary = teacher.salary;
                    dataResponse.teached = teacher.teached;
                    dataResponse.paidSalaryDate = teacher.paidSalaryDate;
                }
            }
            //if role == R3 => create parent then create student role R3
            if (role == "R3") {
                //create parent
                if (
                    !dataRole.parentFirstname ||
                    !dataRole.parentLastname ||
                    !dataRole.parentPhone ||
                    !dataRole.parentEmail ||
                    !dataRole.parentPassword ||
                    !dataRole.parentUsername
                ) {
                    res.send("Missing required field");
                }
                const parentCreate = {
                    firstname: dataRole.parentFirstname,
                    lastname: dataRole.parentLastname,
                    phone: dataRole.parentPhone,
                    email: dataRole.parentEmail,
                    username: dataRole.username,
                    password: await hashPassword(dataRole.password),
                    role: "R2",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                if (dataRole.parentAddress)
                    parentCreate.address = dataRole.parentAddress;
                if (dataRole.parentGender)
                    parentCreate.gender = dataRole.parentGender;
                if (dataRole.parentBirthday)
                    parentCreate.birthday = dataRole.parentBirthday;

                const user = await db.User.create(parentCreate);
                const parent = await db.Parent.create({
                    userID: user.id,
                    zalo: dataRole.zalo || dataRole.parentPhone,
                });
                //create student
                const studentCreate = {
                    userID: data.id,
                    parentId: parent.id,
                    classId: dataRole.classId || null,
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
            }

            return res.send(dataResponse);
        }
    } catch (error) {
        console.log(error);
        res.send("Something went wrong!");
    }
};

module.exports = {
    handleAuthentication,
    handleLogout,
    checkAuthentization,
    hashPassword,
};
