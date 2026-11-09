const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
let current = 0;
let timer;

function show(i) {
  current = (i + slides.length) % slides.length;
  slides.forEach((s, n) => s.classList.toggle("active", n === current));
  dots.forEach((d, n) => d.classList.toggle("active", n === current));
}

function start() {
  timer = setInterval(() => show(current + 1), 5000);
}

function reset() {
  clearInterval(timer);
  start();
}

document.querySelector(".prev").addEventListener("click", () => { show(current - 1); reset(); });
document.querySelector(".next").addEventListener("click", () => { show(current + 1); reset(); });
dots.forEach((d, n) => d.addEventListener("click", () => { show(n); reset(); }));

start();