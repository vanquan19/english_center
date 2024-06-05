const db = require("../models");

const checkRole = (role) => {
    return async (req, res, next) => {
        if (role !== req.user.role) {
            res.send("You are not allowed to access this page");
        } else {
            next();
        }
    };
};

const checkOwnData = (req, res, next) => {
    if (req.user.id !== req.params.id) {
        res.send("You are not allowed to access this page");
    } else {
        next();
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
module.exports = { checkRole, checkOwnData, checkAuthentization };
