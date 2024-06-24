document.addEventListener("DOMContentLoaded", async () => {
    fetch("/api/analysis-student")
        .then((res) => res.json())
        .then((data) => {
            const chartConfig = {
                series: [
                    {
                        name: "Sales",
                        data: data,
                    },
                ],
                chart: {
                    type: "line",
                    height: 240,
                    toolbar: {
                        show: false,
                    },
                },
                title: {
                    show: "",
                },
                dataLabels: {
                    enabled: false,
                },
                colors: ["#020617"],
                stroke: {
                    lineCap: "round",
                    curve: "smooth",
                },
                markers: {
                    size: 0,
                },
                xaxis: {
                    axisTicks: {
                        show: false,
                    },
                    axisBorder: {
                        show: false,
                    },
                    labels: {
                        style: {
                            colors: "#616161",
                            fontSize: "12px",
                            fontFamily: "inherit",
                            fontWeight: 400,
                        },
                    },
                    categories: ["Tháng 1", "Thấng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng9", "Tháng 10", "Tháng 11", "Tháng 12 "],
                },
                yaxis: {
                    labels: {
                        style: {
                            colors: "#616161",
                            fontSize: "12px",
                            fontFamily: "inherit",
                            fontWeight: 400,
                        },
                    },
                },
                grid: {
                    show: true,
                    borderColor: "#dddddd",
                    strokeDashArray: 5,
                    xaxis: {
                        lines: {
                            show: true,
                        },
                    },
                    padding: {
                        top: 5,
                        right: 20,
                    },
                },
                fill: {
                    opacity: 0.8,
                },
                tooltip: {
                    theme: "dark",
                },
            };

            const chart = new ApexCharts(document.querySelector("#line-chart"), chartConfig);

            chart.render();
        });
});
