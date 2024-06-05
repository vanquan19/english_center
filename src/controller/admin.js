const { handleGetBanner } = require("./banner");

const AdminPage = async (req, res) => {
    const banner = await handleGetBanner();
    res.render("admin", { banner: banner, page: "home" });
};

module.exports = {
    AdminPage,
};
