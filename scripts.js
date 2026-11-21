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

document.querySelectorAll("[data-open]").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById(el.dataset.open).showModal();
  });
});

document.querySelectorAll("[data-close]").forEach((btn) => {
  btn.addEventListener("click", () => btn.closest("dialog").close());
});

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.close();
  });
});

document.querySelectorAll(".oko").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = btn.parentElement.querySelector("input");
    const prikazana = input.type === "text";
    input.type = prikazana ? "password" : "text";
    btn.innerHTML = `<i data-lucide="${prikazana ? "eye-off" : "eye"}"></i>`;
    lucide.createIcons();
  });
});

const cartDialog = document.getElementById("cart-dialog");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");

let korpa = [];
try {
  korpa = JSON.parse(localStorage.getItem("korpa")) || [];
} catch (e) {
  korpa = [];
}

function formatCena(n) {
  return n.toLocaleString("en-US") + " RSD";
}

function sacuvaj() {
  try {
    localStorage.setItem("korpa", JSON.stringify(korpa));
  } catch (e) { }
}

function prikazi() {
  cartItems.innerHTML = korpa.map((item, i) => `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.name}">
      <div class="cart-item-info">
        <p>${item.name}</p>
        <strong>${formatCena(item.price)}</strong>
      </div>
      <button type="button" class="cart-remove" data-index="${i}" aria-label="Ukloni">
        <i data-lucide="x"></i>
      </button>
      <span class="cart-qty">${item.qty}</span>
    </div>
  `).join("");

  const ukupno = korpa.reduce((s, it) => s + it.qty, 0);
  cartCount.textContent = ukupno;
  document.getElementById("cart-badge").textContent = ukupno;
  cartTotal.textContent = formatCena(korpa.reduce((s, it) => s + it.price * it.qty, 0));
  lucide.createIcons();
}

document.addEventListener("click", (e) => {
  const plus = e.target.closest(".plus");
  if (!plus) return;

  const card = plus.closest(".card");
  const p = card.querySelectorAll("p");
  const name = p[0].textContent.replace(/\s+/g, " ").trim();
  const price = parseInt(p[1].textContent.replace(/\D/g, ""), 10);
  const img = card.querySelector("img").getAttribute("src");

  const postojeci = korpa.find((it) => it.name === name);
  if (postojeci) {
    postojeci.qty++;
  } else {
    korpa.push({ name, price, img, qty: 1 });
  }

  sacuvaj();
  prikazi();
});

cartItems.addEventListener("click", (e) => {
  const btn = e.target.closest(".cart-remove");
  if (!btn) return;
  const i = Number(btn.dataset.index);
  if (korpa[i].qty > 1) {
    korpa[i].qty--;
  } else {
    korpa.splice(i, 1);
  }
  sacuvaj();
  prikazi();
});

document.querySelector(".cart-clear").addEventListener("click", () => {
  korpa = [];
  sacuvaj();
  prikazi();
});

cartDialog.addEventListener("click", (e) => {
  const r = cartDialog.getBoundingClientRect();
  const unutra = e.clientX >= r.left && e.clientX <= r.right &&
    e.clientY >= r.top && e.clientY <= r.bottom;
  if (!unutra) cartDialog.close();
});

prikazi();

document.addEventListener("dragstart", (e) => {
  if (e.target.tagName === "IMG") e.preventDefault();
});

