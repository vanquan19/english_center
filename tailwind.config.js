/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/views/*.ejs"],
    theme: {
        extend: {
            colors: {
                clifford: "#da373d",
                primary: {
                    500: "rgb(59 130 246 / 1)",
                    600: "rgb(37 99 235 / 1)",
                    700: "rgb(29 78 216 / 1)",
                    800: "rgb(30 64 175 / 1)",
                },
            },
            keyframes: {
                faceright: {
                    "0%": { transform: "translateX(100vw)" },
                    "100%": { transform: "translateX(0)" },
                },
                faceleft: {
                    "0%": { transform: "translateX(-100vw)" },
                    "100%": { transform: "translateX(0)" },
                },
                scaleY: {
                    "0%": { transform: "scaleY(0)" },
                    "100%": { transform: "scaleY(1)" },
                },
                hiddenScaleY: {
                    "0%": { transform: "scaleY(1)" },
                    "100%": { transform: "scaleY(0)" },
                },
            },
            animation: {
                faceright: "faceright 0.3s linear",
                faceleft: "faceleft 0.3s linear",
                scaleY: "scaleY 0.3s linear",
                hiddenScaleY: "hiddenScaleY 0.3s linear",
            },
        },
        plugins: [],
    },
};
