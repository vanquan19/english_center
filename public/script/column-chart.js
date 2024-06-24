document.addEventListener("DOMContentLoaded", function () {
    fetch("/api/fee-student")
        .then((res) => res.json())
        .then((data) => {
            const options = {
                colors: ["#1A56DB", "#FDBA8C"],
                series: [
                    {
                        name: "Học phí dự kiến",
                        color: "#c7d2ff",
                        data: data.seriesFee,
                    },
                    {
                        name: "Học phí đã thu",
                        color: "#a6b4fd",
                        data: data.seriesFeePaid,
                    },
                    {
                        name: "Đã thanh toán cho giáo viên",
                        color: "#818cf8",
                        data: data.seriesSalaryFollowMonth,
                    },
                ],
                chart: {
                    type: "bar",
                    height: "320px",
                    fontFamily: "Inter, sans-serif",
                    toolbar: {
                        show: false,
                    },
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: "70%",
                        borderRadiusApplication: "end",
                        borderRadius: 2,
                    },
                },
                tooltip: {
                    shared: true,
                    intersect: false,
                    style: {
                        fontFamily: "Inter, sans-serif",
                    },
                },
                states: {
                    hover: {
                        filter: {
                            type: "darken",
                            value: 1,
                        },
                    },
                },
                stroke: {
                    show: true,
                    width: 0,
                    colors: ["transparent"],
                },
                grid: {
                    show: false,
                    strokeDashArray: 4,
                    padding: {
                        left: 2,
                        right: 2,
                        top: -14,
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                legend: {
                    show: false,
                },
                xaxis: {
                    floating: false,
                    labels: {
                        show: true,
                        style: {
                            fontFamily: "Inter, sans-serif",
                            cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
                        },
                    },
                    axisBorder: {
                        show: false,
                    },
                    axisTicks: {
                        show: false,
                    },
                },
                yaxis: {
                    show: false,
                },
                fill: {
                    opacity: 1,
                },
            };

            if (document.getElementById("column-chart-month") && typeof ApexCharts !== "undefined") {
                const chart = new ApexCharts(document.getElementById("column-chart-month"), options);
                chart.render();
            }

            const optionsPerious = {
                colors: ["#1A56DB", "#FDBA8C"],
                series: [
                    {
                        name: "Học phí phải đóng",
                        color: "#c7d2ff",
                        data: data.allFeeOfPeriod,
                    },
                    {
                        name: "Học phí đã đóng",
                        color: "#a6b4fd",
                        data: data.feePaidPeriod,
                    },
                    {
                        name: "Đã thanh toán cho giáo viên",
                        color: "#818cf8",
                        data: data.seriesSalaryFollowPeriod,
                    },
                ],
                chart: {
                    type: "bar",
                    height: "320px",
                    fontFamily: "Inter, sans-serif",
                    toolbar: {
                        show: false,
                    },
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: "70%",
                        borderRadiusApplication: "end",
                        borderRadius: 8,
                    },
                },
                tooltip: {
                    shared: true,
                    intersect: false,
                    style: {
                        fontFamily: "Inter, sans-serif",
                    },
                },
                states: {
                    hover: {
                        filter: {
                            type: "darken",
                            value: 1,
                        },
                    },
                },
                stroke: {
                    show: true,
                    width: 0,
                    colors: ["transparent"],
                },
                grid: {
                    show: false,
                    strokeDashArray: 4,
                    padding: {
                        left: 2,
                        right: 2,
                        top: -14,
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                legend: {
                    show: false,
                },
                xaxis: {
                    floating: false,
                    labels: {
                        show: true,
                        style: {
                            fontFamily: "Inter, sans-serif",
                            cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
                        },
                    },
                    axisBorder: {
                        show: false,
                    },
                    axisTicks: {
                        show: false,
                    },
                },
                yaxis: {
                    show: false,
                },
                fill: {
                    opacity: 1,
                },
            };
            if (document.getElementById("column-chart-precious") && typeof ApexCharts !== "undefined") {
                const chart = new ApexCharts(document.getElementById("column-chart-precious"), optionsPerious);
                chart.render();
            }
        });
});
