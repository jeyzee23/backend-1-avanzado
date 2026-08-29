const socket = io();
const form = document.querySelector("#service-form");
const list = document.querySelector("#services-list");
const errorBox = document.querySelector("#form-error");

const renderServices = (services) => {
  list.innerHTML = services
    .map(
      (service) => `
        <li class="card" data-id="${service.id}">
          <p class="meta">${service.category} · ${service.duration} min</p>
          <h2>${service.name}</h2>
          <p>${service.description}</p>
          <p class="price">$${service.price}</p>
          <span class="badge ${service.available ? "ok" : "no"}">
            ${service.available ? "Disponible" : "No disponible"}
          </span>
        </li>
      `
    )
    .join("");
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  errorBox.hidden = true;

  const data = Object.fromEntries(new FormData(form));
  data.duration = Number(data.duration);
  data.price = Number(data.price);
  data.available = true;

  socket.emit("createService", data);
  form.reset();
  form.elements.duration.value = 30;
  form.elements.price.value = 18000;
  form.elements.category.value = "estetica";
});

socket.on("servicesUpdated", (services) => {
  renderServices(services);
});

socket.on("serviceError", ({ message }) => {
  errorBox.hidden = false;
  errorBox.textContent = message;
});
