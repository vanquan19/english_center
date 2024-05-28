const handleImage = (image) => {
    let formImage = "png";
    switch (image[0]) {
        case "i":
            formImage = "png";
            break;
        case "/":
            formImage = "jpg";
            break;
        case "U":
            formImage = "webp";
            break;
        default:
            formImage = "png";
            break;
    }
    return `data:image/${formImage};base64,${image}`;
};

module.exports = handleImage;
