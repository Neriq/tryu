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

    // спочатку очистимо попередні помилки
    clearErrors();

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

  document.addEventListener("click", (e) => {
    const isOpen = nav.classList.contains(openCls);
    if (!isOpen) return;
    const clickedInsideNav = e.target.closest(navSel);
    const clickedBtn = e.target.closest(btnSel);
    if (!clickedInsideNav && !clickedBtn) {
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

const input = document.querySelector("#user-input");
const addBtn = document.querySelector("#add-btn");
const list = document.querySelector("#list");
const msg = document.querySelector("#msg");

function showMessage(text, isError = false) {
  msg.textContent = text;
  msg.style.color = isError ? "#ef4444" : "";
}

addBtn.addEventListener("click", () => {
  const text = (input.value ?? "").trim();

  if (!text) {
    input.classList.add("input-error");
    showMessage("Введи текст перед додаванням", true);
    input.focus();
    return;
  }

  const li = document.createElement("li");
  li.textContent = true;

  const delBtn = document.createElement("button");
  delBtn.textContent = "x";
  delBtn.style.marginLeft = "8px";
  delBtn.addEventListener("click", () => {
    li.remove();
    saveList();
  });

  li.appendChild(delBtn);
  list.appendChild(li);

  input.value = "";
  input.classList.remove("input-error");
  showMessage("Додано ✔️");

  saveList();
});

input.addEventListener("input", () => {
  if (input.classList.contains("input-error")) {
    input.classList.remove("input-error");
    showMessage("");
  }
});

function saveList() {
  const items = Array.from(list.querySelectorAll("li"))
    .map((li) => li.firstChild?.textContent ?? "")
    .filter(Boolean);
  localStorage.setItem("myList", JSON.stringify(items));
}

function loadList() {
  const raw = localStorage.getItem("myList");
  if (!raw) return;
  const items = JSON.parse(raw);

  items.forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    const delBtn = document.createElement("button");
    delBtn.textContent = "x";
    delBtn.style.marginLeft = "8px";
    delBtn.addEventListener("click", () => {
      li.remove();
      saveList();
    });
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", loadList);
