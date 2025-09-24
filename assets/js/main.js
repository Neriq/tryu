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
const listEl = document.querySelector("#list");
const msgEl = document.querySelector("#msg");

let items = [];
const LS_KEY = "myList.v2";

function setMsg(text = "", isError = false) {
  msgEl.textContent = text;
  msgEl.style.color = isError ? "#ef4444" : "";
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function render() {
  listEl.innerHTML = "";
  const frag = document.createDocumentFragment();

  items.forEach((item) => {
    const li = document.createElement("li");
    li.dataset.id = item.id;
    li.tabIndex = 0;

    const span = document.createElement("span");
    span.textContent = item.text;
    span.className = "item-text";

    const del = document.createElement("button");
    del.textContent = "x";
    del.className = "item-del";
    del.ariaLabel = "Видалити пункт";

    li.append(span, del);
    frag.appendChild(li);
  });

  listEl.appendChild(frag);
}

function save() {
  localStorage.setItem(LS_KEY, JSON.stringify(items));
}

function load() {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return;
  try {
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) items = arr;
  } catch {}
}

function addItem(text) {
  items.push({ id: uid(), text });
  save();
  render();
}

function removeItem(id) {
  items = items.filter((x) => x.id !== id);
  save();
  render();
}

function updateItem(id, text) {
  const it = items.find((x) => x.id === id);
  if (!it) return;
  it.text = text;
  save();
  render();
}

input.addEventListener("keydown", (e) => {
  // слухаємо натискання клавіш у полі вводу
  if (e.key === "Enter") {
    // якщо натиснули Enter
    e.preventDefault(); // на випадок, якщо колись обгорнеш у <form>
    addBtn.click(); // повторно використовуємо вже існуючий обробник кліку
  }
});

addBtn.addEventListener("click", () => {
  const text = (input.value ?? "").trim();
  if (!text) {
    input.classList.add("input-error");
    setMsg("Введи текст перед додаванням", true);
    input.focus();
    return;
  }
  addItem(text);
  input.value = "";
  input.classList.remove("input-error");
  setMsg("Додано");
});

input.addEventListener("input", () => {
  if (input.classList.contains("input-error")) {
    input.classList.remove("input-error");
    setMsg("");
  }
});

listEl.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;
  const id = li.dataset.id;

  if (e.target.matches(".item-del")) {
    removeItem(id);
  }
});

listEl.addEventListener("dblclick", (e) => {
  const span = e.target.closest(".item-text");
  if (!span) return;
  const li = span.closest("li");
  const id = li.dataset.id;
  const old = span.textContent;

  const edit = document.createElement("input");
  edit.type = "text";
  edit.value = old;
  edit.className = "edit-input";
  span.replaceWith(edit);
  edit.focus();

  const commit = () => {
    const val = (edit.value ?? "").trim();
    if (!val) {
      cancel();
      return;
    }
    updateItem(id, val);
  };

  const cancel = () => {
    render();
  };

  edit.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") commit();
    else if (ev.key === "Escape") cancel();
  });
  edit.addEventListener("blur", commit);
});

document.addEventListener("DOMContentLoaded", () => {
  load();
  render();
});

const POSTS_API = "https://jsonplaceholder.typicode.com/posts?_limit=6";
const postsListEl = document.querySelector("#posts-list");
const postsStatusEl = document.querySelector("#posts-status"); // де показувати "Йде завантаження..." / помилки
const loadBtn = document.querySelector("#load-posts");

let postsState = [];
let currentController = null;

function setStatus(text = "", type = "") {
  postsStatusEl.textContent = text;
  postsStatusEl.classList.remove("status--loading", "status-error");
  if (type) postsStatusEl.classList.add(type);
}

function renderPosts() {
  postsListEl.innerHTML = "";
  const frag = document.createDocumentFragment();

  postsState.forEach((p) => {
    const card = document.createElement("article");
    card.className = "post-card";
    const h3 = document.createElement("h3");
    h3.textContent = p.title;
    const body = document.createElement("p");
    body.textContent = p.body;
    card.append(h3, body);
    frag.appendChild(card);
  });

  postsListEl.appendChild(frag);
}

async function fetchPosts() {
  if (currentController) currentController.abort();

  currentController = new AbortController();
  const { signal } = currentController;

  try {
    setStatus("Йде завантаження...", "status-loading");
    loadBtn.disabled = true;

    const res = await fetch(POSTS_API, { signal });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      throw new Error("Unexpected payload");
    }
    postsState = data.map(({ id, title, body }) => ({ id, title, body }));

    renderPosts();
    setStatus("Готово");
  } catch (err) {
    setStatus("Помилка завантаження. Спробуйте ще раз.", "status--error");
  } finally {
    loadBtn.disabled = false;
    currentController = null;
  }
}

loadBtn.addEventListener("click", () => {
  fetchPosts();
});

document.addEventListener("DOMContentLoaded", () => {
  // fetchPosts();
});
