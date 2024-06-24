class Validator {
    init({ form, rules }) {
        const formSelector = document.querySelector(form);
        formSelector.onsubmit = (e) => {
            e.preventDefault();
            let isFormValid = true;
            rules.forEach((rule) => {
                const input = formSelector.querySelector(rule.selector);
                const value = input.value;
                const test = rule.test(value);
                if (!test) {
                    isFormValid = false;
                    const errorElement = input.parentElement.querySelector(".error");
                    errorElement.innerText = rule.message || "Invalid input";
                }
                input.oninput = () => {
                    const errorElement = input.parentElement.querySelector(".error");
                    errorElement.innerText = "";
                };
            });
            if (isFormValid) {
                formSelector.submit();
            }
        };
    }
    isEmail(selector) {
        const re = /\S+@\S+\.\S+/;
        return {
            selector: selector,
            message: "Email không hợp lệ!",
            test: (value) => re.test(value),
        };
    }
    isRequired(selector) {
        return {
            selector: selector,
            message: "Trường này không được để trống!",
            test: (value) => value.trim() !== "",
        };
    }
    isConfirmed(selector, getConfirmValue) {
        return {
            selector: selector,
            message: "Giá trị không khớp!",
            test: (value) => value === getConfirmValue(),
        };
    }
    isMinLength(selector, min) {
        return {
            selector: selector,
            message: `Vui lòng nhập tối thiểu ${min} ký tự!`,
            test: (value) => value.length >= min,
        };
    }
}
