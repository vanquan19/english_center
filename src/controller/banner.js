const { Op } = require("sequelize");
const db = require("../models");
const handleImage = require("../util/handleImage");

const defaultBanner = [
    {
        image: "/images/banner2.jpg",
        content: "Banner 1",
    },
    {
        image: "/images/banner3.webp",
        content: "Banner 2",
    },
];

const handleCreateBanner = async (req, res) => {
    try {
        const { image, content, startDate, endDate } = req.body;
        const data = await db.Banner.create({
            image: image,
            content: content,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
        });
        res.send(data);
    } catch (error) {
        res.send("Something went wrong!");
    }
};

const handleGetBanner = async (req, res) => {
    try {
        const data = await db.Banner.findAll({
            // where: {
            //     // startDate: {
            //     //     [Op.lte]: new Date(),
            //     // },
            //     // endDate: {
            //     //     [Op.gte]: new Date(),
            //     // },
            // },
        });
        let dataResponse = [];
        if (data.length > 0) {
            data.forEach((item) => {
                dataResponse.push({
                    image: handleImage(item.image),
                    content: item.content,
                });
            });
        }
        dataResponse = [...dataResponse, ...defaultBanner];
        return dataResponse;
    } catch (error) {
        return [];
    }
};
const handleDeleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await db.Banner.destroy({
            where: {
                id: id,
            },
        });
        res.send(data);
    } catch (error) {
        res.send("Something went wrong!");
    }
};

module.exports = {
    handleCreateBanner,
    handleGetBanner,
};
