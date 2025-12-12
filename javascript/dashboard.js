const map = document.getElementById("map-image");
const container = document.getElementById("map-container");

let isDragging = false;
let startX, startY;
let currentX = 0, currentY = 0;

container.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX - currentX;
    startY = e.clientY - currentY;
});

container.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    currentX = e.clientX - startX;
    currentY = e.clientY - startY;
    map.style.transform = `translate(${currentX}px, ${currentY}px)`;
});

container.addEventListener("mouseup", () => isDragging = false);
container.addEventListener("mouseleave", () => isDragging = false);
