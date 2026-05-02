const buttons = document.querySelectorAll(".switch-btn");
const maps = document.querySelectorAll(".map");

buttons.forEach(btn => {
    btn.addEventListener("click", () => {

        // кнопки
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // карты
        maps.forEach(map => map.classList.remove("active"));

        if (btn.dataset.map === "google") {
            document.getElementById("googleMap").classList.add("active");
        } else {
            document.getElementById("yandexMap").classList.add("active");
        }
    });
});
