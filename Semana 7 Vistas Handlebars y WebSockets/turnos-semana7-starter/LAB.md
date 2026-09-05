# Laboratorio — Semana 7

La API ya anda. No la reescribas. Hoy se suman vistas y tiempo real.

Si te trabás, mirá `../turnos-semana7-completa`. No copies el proyecto entero.

```
Cliente HTML  →  views.router  →  manager  →  JSON
Cliente JSON  →  api router    →  controller  →  manager  →  JSON
Browser socket →  socket.js    →  manager  →  io.emit  →  todos los browsers
```

## 1. Encender Handlebars

`src/app.js`

- Importar `engine` de `express-handlebars`
- `app.engine` / `app.set("view engine")` / `app.set("views")`
- Montar `viewsRouter` en `"/"`

## 2. `res.render` en vez de `res.json`

`src/routes/views.router.js` — una ruta a la vez, en este orden:

1. `/services`
2. `/services/:sid`
3. `/bookings/:bid`
4. `/` y `/bookings` si sobra tiempo
5. `/realtime` al final, cuando pases a sockets

## 3. Escribir las plantillas

`src/views/` — el layout ya está. Completar:

- `services.handlebars` → `{{#each services}}`
- `service-detail.handlebars` → `{{service.name}}`
- `booking-detail.handlebars` → datos + `{{#each booking.services}}`

Probar en el browser. Postman sigue siendo para `/api`.

## 4. El cable de Socket.io

`src/server.js` — `createServer(app)` + `setupSocket` + `httpServer.listen`.

`src/config/socket.js` — al recibir el alta: persistir y `io.emit` de la lista.

## 5. Avisar también desde la API

`services.controller.js` — después de create / update / delete, emitir.
Así Postman también actualiza el tablero.

## 6. El browser

`realtime.handlebars` — carga inicial con `{{#each}}` + los dos `<script>`.

`src/public/js/realtime.js` — `io()`, `socket.emit` al submit, `socket.on` para repintar la lista.

## Demo que cierra

Dos ventanas en `/realtime`. Form en una. Postman **Crear servicio**. Las dos se mueven.
