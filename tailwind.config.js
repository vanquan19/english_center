const { he } = require("date-fns/locale");

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
                hiddenright: {
                    "0%": { transform: "translateX(0)" },
                    "100%": { transform: "translateX(100vw)" },
                },
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
                facein: {
                    "0%": { opacity: 0, transform: "translateY(20px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                },
                hiddenout: {
                    "0%": { opacity: 1, transform: "translateY(0)" },
                    "100%": { opacity: 0, transform: "translateY(20px)" },
                },
                facetable: {
                    "0%": { transform: "scale(0.8)" },
                    "100%": { transform: "scale(1)" },
                },
                scrollDown: {
                    "0%": { height: "0" },
                    "100%": { height: "100%" },
                },
                scrollUp: {
                    "0%": { height: "100%" },
                    "100%": { height: "0" },
                },
                marquee: {
                    "0%": { "text-indent": "100%" },
                    "100%": { "text-indent": "-100%" },
                },
            },
            animation: {
                faceright: "faceright 0.3s linear",
                hiddenright: "hiddenright 0.3s linear",
                faceleft: "faceleft 0.3s linear",
                scaleY: "scaleY 0.3s linear",
                hiddenScaleY: "hiddenScaleY 0.3s linear",
                facein: "facein 0.3s linear",
                hiddenout: "hiddenout 0.3s linear",
                scaletable: "facetable 0.3s linear",
                scrollDown: "scrollDown 0.3s linear",
                scrollUp: "scrollUp 0.3s linear",
                marquee: "marquee 20s linear infinite",
            },
            scrollbar: {
                hide: {
                    /* Ẩn thanh cuộn ngang và dọc */
                    "&::-webkit-scrollbar": { display: "none" },
                    "&": {
                        "scrollbar-width": "none",
                        "-ms-overflow-style": "none",
                    },
                },
            },
        },
        screens: {
            sm: "640px",
            // => @media (min-width: 640px) { ... }

            md: "768px",
            // => @media (min-width: 768px) { ... }
            tb: "960px",

            lg: "1024px",
            // => @media (min-width: 1024px) { ... }

            xl: "1280px",
            // => @media (min-width: 1280px) { ... }

            "2xl": "1536px",
            // => @media (min-width: 1536px) { ... }
        },
        plugins: [
            function ({ addUtilities }) {
                addUtilities({
                    ".scrollbar-hide": {
                        "&::-webkit-scrollbar": { display: "none" },
                        "&": {
                            "scrollbar-width": "none",
                            "-ms-overflow-style": "none",
                        },
                    },
                });
            },
        ],
    },
};
