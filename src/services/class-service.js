const { eachDayOfInterval, isToday } = require("date-fns");
const { el } = require("date-fns/locale");
const e = require("express");
const db = require("../models");

const handleAddEvent = async (req, res) => {
    const { classID, startDate, shift, day, endDate } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
        throw new Error("Start date must be before end date");
    }
    if (!endDate && !day) {
        await db.ClassSession.create({
            classID: +classID,
            date: start,
            shift: shift,
        });
        return res.redirect(`/class-management-calendar?id=${classID}`);
    }
    const allDays = eachDayOfInterval({
        start: start,
        end: end,
    });

    allDays.forEach(async (item) => {
        const dayOfWeek = item.getDay();
        if (day.includes(dayOfWeek.toString())) {
            await db.ClassSession.create({
                classID: +classID,
                date: item,
                shift: shift,
            });
        }
    });
    return res.redirect(`/class-management-calendar?id=${classID}`);
};

module.exports = { handleAddEvent };
