const handleOpen = (targetId, animaionShow, animationHide, delay = 300, type) => {
    const target = document.getElementById(targetId);
    if (target.getAttribute("data-open") === "true") {
        target.classList.add(animationHide);
        setTimeout(() => {
            target.classList.add("hidden");
            target.classList.remove(animationHide);
            target.setAttribute("data-open", "false");
        }, delay - 50);
    } else {
        if (type) {
            target.classList.add(type);
        }
        target.classList.remove("hidden");
        target.classList.add(animaionShow);
        target.setAttribute("data-open", "true");
        setTimeout(() => {
            target.classList.remove(animaionShow);
        }, delay);
    }
};

const handleControlPage = (type, curent, href) => {
    let pageCurent = parseInt(curent);
    if (type === "back") {
        pageCurent--;
        console.log(`${href}/${pageCurent}`);
        window.location.href = `${href}/${pageCurent}`;
    } else if (type === "next") {
        pageCurent++;
        console.log(`${href}/${pageCurent}`);
        window.location.href = `${href}/${pageCurent}`;
    } else {
        window.location.href = href;
    }
};

const hiddenPassword = (id, btn1, btn2) => {
    const input = document.getElementById(id);
    const buttonShow = document.getElementById(btn1);
    const buttonHide = document.getElementById(btn2);
    buttonShow.classList.toggle("hidden");
    buttonHide.classList.toggle("hidden");
    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
};
