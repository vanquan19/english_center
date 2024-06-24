document.addEventListener("DOMContentLoaded", () => {
    fetch("/api/banner")
        .then((res) => res.json())
        .then((data) => {
            const showSlider = document.getElementById("show_slider");
            let html = "";
            data.forEach((item) => {
                html += `
                    <div class="hidden duration-700 ease-in-out" data-carousel-item>
                        <img src="${item.image}" class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="...">
                    </div>

                `;
            });
            showSlider.innerHTML = html;
        });
});
