// 1) Чекаємо, поки DOM готовий (із defer це не строго потрібно, але це гарна звичка)
document.addEventListener("DOMContentLoaded", () => {
  setCurrentYear();
  setupContactForm();
  renderProjects();
  setupScrollAnimations();
});

/** Поставити поточний рік у футері */
function setCurrentYear() {
  const el = document.querySelector("#year");
  if (el) el.textContent = new Date().getFullYear();
}

/** Налаштувати валідацію контактної форми */
function setupContactForm() {
  const form = document.querySelector("#contact-form");
  const response = document.querySelector("#response");
  if (!form || !response) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.querySelector("#name")?.value.trim();
    const email = form.querySelector("#email")?.value.trim();
    const message = form.querySelector("#message")?.value.trim();

    if (!name || !email || !message) {
      showMessage(response, "Будь ласка, заповніть усі поля.", true);
      return;
    }

    const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!looksLikeEmail) {
      showMessage(response, "Перевірте email — виглядає некоректно.", true);
      return;
    }

    showMessage(
      response,
      `Дякуємо, ${name}! Ваше повідомлення отримано.`,
      false
    );
    form.reset();
  });
}

/** Допоміжна: показ повідомлення */
function showMessage(node, text, isMuted) {
  node.textContent = text;
  if (isMuted) node.classList.add("muted");
  else node.classList.remove("muted");
}

/** (Опціонально) рендер списку проєктів із даних */
function renderProjects() {
  const projects = [
    { title: "Лендінг", desc: "Простий адаптивний лендінг на HTML+CSS." },
    { title: "Міні-блог", desc: "Список статей рендериться з JS-масиву." },
    { title: "Контакт-форма", desc: "Валідація на клієнті, далі бекенд." },
  ];
  const wrap = document.querySelector("#projects");
  if (!wrap) return;

  wrap.innerHTML = ""; // очистити існуюче
  for (const p of projects) {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `<h3>${p.title}</h3><p class="muted">${p.desc}</p>`;
    wrap.appendChild(card);
  }
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const id = link.getAttribute("href");
    if (!id || id === "#") return;

    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

const PROJECTS = [
  {
    title: "Ледінг",
    desc: "Адаптивний лендінг на HTML + CSS.",
    url: "#",
    tags: ["HTML", "CSS"],
  },
  {
    title: "Міні-Блог",
    desc: "Рендер статей із JS-масиву.",
    url: "#",
    tags: ["JS"],
  },
  {
    title: "Контакт-форма",
    desc: "Валідація полів на клієнті.",
    url: "#",
    tags: ["JS", "Forms"],
  },
];

function renderProjects(list = PROJECTS) {
  const wrap = document.querySelector("#projects");
  if (!wrap) return;

  wrap.innerHTML = ""; // очистити поточний вміст
  const frag = document.createDocumentFragment();

  list.forEach((p) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <h3>${p.title}</h3>
      <p class="muted">${p.desc}</p>
      ${
        p.tags?.length
          ? `<div class="tags">${p.tags
              .map((t) => `<span class="tag">${t}</span>`)
              .join("")}</div>`
          : ""
      }
      ${
        p.url
          ? `<a class="btn" href="${p.url}" target="_blank" rel="noopener noreferrer">Відкрити</a>`
          : ""
      }
    `;
    frag.appendChild(card);
  });

  wrap.appendChild(frag);
}

function setupScrollAnimations() {
  const cards = document.querySelectorAll(".card");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  cards.forEach((c) => io.observe(c));
}
