// 1) Чекаємо, поки DOM готовий (із defer це не строго потрібно, але це гарна звичка)
document.addEventListener("DOMContentLoaded", () => {
  setCurrentYear();
  setupContactForm();

  renderProjects();
  setupScrollAnimations();

  setupBurgerMenu();
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

const PROJECTS = [
  {
    title: "Лендінг",
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

function setupSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  // висота шапки, якщо вона sticky
  const header = document.querySelector(".site-header");
  const headerH = header ? header.offsetHeight : 0;

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      // ігноруємо порожні/неправильні якорі
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      // позиція елемента з поправкою на шапку
      const top =
        target.getBoundingClientRect().top + window.pageYOffset - headerH - 8; // -8px запас
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  // бонус: щоб браузер якір із URL теж прокручував з відступом
  if (location.hash) {
    const target = document.querySelector(location.hash);
    if (target) {
      setTimeout(() => {
        const top =
          target.getBoundingClientRect().top + window.pageYOffset - headerH - 8;
        window.scrollTo({ top, behavior: "smooth" });
      }, 0);
    }
  }
}

function setupBurgerMenu(opts = {}) {
  const btnSel = opts.buttonSelector ?? ".burger";
  const navSel = opts.navSelector ?? "#mainnav";
  const openCls = opts.openClass ?? "is-open";

  const btn = document.querySelector(btnSel);
  const nav = document.querySelector(navSel);
  if (!btn || !nav) return;

  btn.setAttribute("aria-controls", nav.id || "");
  btn.setAttribute("aria-expanded", "false");

  btn.addEventListener("click", (e) => {
    const isOpen = nav.classList.toggle(openCls);
    btn.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (a) {
      nav.classList.remove(openCls);
      btn.setAttribute("aria-expanded", "false");
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      nav.classList.remove(openCls);
      btn.setAttribute("aria-expanded", "false");
    }
  });
}
