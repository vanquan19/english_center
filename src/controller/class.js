const Class = require("../models/Class");
const db = require("../models/index");
const handleCreateClass = async (req, res) => {
    try {
        const { name, year, startAt, status, price } = req.body;
        const data = await db.Class.create({
            name: name,
            year: year,
            startAt: new Date(startAt),
            status: status,
            price: price,
        });
        res.send(data);
    } catch (error) {
        res.send("Something went wrong!");
    }
};

const handleGetClass = async (req, res) => {
    const data = await db.Class.findAll();
    res.send(data);
};

const handleGetClassById = async (req, res) => {
    const { id } = req.params;
    const data = await db.Class.findOne({
        where: {
            id: id,
        },
    });
    res.send(data);
};

const handleUpdateClass = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, year, startAt, status, price } = req.body;
        const data = await db.Class.update(
            {
                name: name,
                year: year,
                startAt: new Date(startAt),
                status: status,
                price: price,
            },
            {
                where: {
                    id: id,
                },
            }
        );
        res.send(data);
    } catch (error) {
        res.send("Something went wrong!");
    }
};

const handleUpdateStatus = async (req, res) => {
    try {
        const { id, status } = req.params;
        const data = await db.Class.update(
            {
                status: status,
            },
            {
                where: {
                    id: id,
                },
            }
        );
        res.send(data);
    } catch (error) {
        res.send("Something went wrong!");
    }
};

const handleAddStudent = async (req, res) => {
    try {
        const { id, classID } = req.params;
        const data = await db.Student.update(
            {
                classID: classID,
            },
            {
                where: {
                    id: id,
                },
            }
        );
        res.send(data);
    } catch (error) {
        res.send("Something went wrong!");
    }
};

const handleCreateClassSession = async (req, res) => {
    try {
        const { classID, dates } = req.body;
        dates.map(async (date) => {
            const data = await db.ClassSession.create({
                classID: classID,
                date: new Date(date),
            });
        });
        res.send(data);
    } catch (error) {
        res.send("Something went wrong!");
    }
};

const handleAttendance = async (req, res) => {
    try {
        const { ClassSession, studentID, status } = req.body;
        const data = await db.Attendance.create({
            ClassSession: ClassSession,
            studentID: studentID,
            status: status,
        });
        res.send(data);
    } catch (error) {
        res.send("Something went wrong!");
    }
};

const handleUpdateAttendance = async (req, res) => {
    try {
        const { id, status } = req.params;
        const data = await db.Attendance.update(
            {
                status: status,
            },
            {
                where: {
                    id: id,
                },
            }
        );
        res.send(data);
    } catch (error) {
        res.send("Something went wrong!");
    }
};

module.exports = {
    handleCreateClass,
    handleGetClass,
    handleGetClassById,
    handleUpdateClass,
    handleUpdateStatus,
    handleAddStudent,
    handleCreateClassSession,
    handleAttendance,
    handleUpdateAttendance,
};
