const form = document.querySelector("#service-form");
const list = document.querySelector("#services-list");
const errorBox = document.querySelector("#form-error");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  data.duration = Number(data.duration);
  data.price = Number(data.price);
  data.available = true;

  // Enviar el servicio al server por socket (no por fetch)
  console.log("TODO: emitir al server", data);
  form.reset();
});

// Escuchar la lista actualizada y volver a pintar #services-list
// Escuchar errores y mostrarlos en #form-error
