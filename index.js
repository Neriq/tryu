const form = document.getElementById("contact-form");
const response = document.getElementById("response");
const sendBtn = document.getElementById("send-btn");

const fields = {
  name: {
    el: document.getElementById("name"),
    err: document.getElementById("err-name"),
  },
  email: {
    el: document.getElementById("email"),
    err: document.getElementById("err-email"),
  },
  message: {
    el: document.getElementById("message"),
    err: document.getElementById("err-message"),
  },
  company: {
    el: document.getElementById("company"),
  },
};

function showError(key, msg) {
  const node = fields[key]?.err;
  if (node) node.innerText = msg || "";
}

function validate() {
  let ok = true;
  showError("name", "");
  showError("email", "");
  showError("message", "");

  const name = fields.name.el.value.trim();
  const email = fields.email.el.value.trim();
  const message = fields.message.el.value.trim();
  const bot = fields.company.el.value.trim();

  if (bot) {
    ok = false;
  }
  if (name.length < 2) {
    showError("name", "Введіть імʼя (мін. 2 символи).");
    ok = false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    showError("email", "Введіть коректний email.");
    ok = false;
  }
  if (message.length < 5) {
    showError("message", "Повідомлення занадто коротке.");
    ok = false;
  }
  return ok;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  response.innerText = "";
  if (!validate()) return;

  sendBtn.disabled = true;
  setTimeout(() => {
    response.innerText = `Дякуємо, ${fields.name.el.value.trim()}! Ваше повідомлення отримано.`;
    form.reset();
    sendBtn.disabled = false;
  }, 600);
});

["input", "blur"].forEach((evt) => {
  form.addEventListener(
    evt,
    (e) => {
      const id = e.target?.id;
      if (!id) return;
      // Легка перевірка “на льоту”
      validate();
    },
    true
  );
});
