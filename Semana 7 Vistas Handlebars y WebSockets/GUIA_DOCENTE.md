# Cómo dar la clase — Handlebars y WebSockets

Leé esto de arriba a abajo. No hace falta memorizar nada: cada bloque dice **qué decir** y **qué hacer**.

Duración: ~2 horas.

**Dos pantallas, siempre:**

| Izquierda (se escribe) | Derecha (se mira, no se toca) |
| --- | --- |
| `turnos-semana7-starter` | `turnos-semana7-completa` |

Vas tema por tema: mirás el archivo de la completa, lo armás en el starter, demostrás, siguiente. No adelantes el archivo entero.

---

## 0. Antes de que entre nadie (10 min)

1. En una terminal:

```bash
cd turnos-semana7-completa
npm install
npm run dev
```

2. En el browser: http://localhost:8080 y http://localhost:8080/realtime  
3. En Postman: importá `postman/Handlebars-WebSockets.postman_collection.json`  
4. Dejá la completa **minimizada**. La clase se arma sobre el **starter**.

Si el puerto 8080 está ocupado, matá el proceso o usá `PORT=8081 npm run dev`.

---

## 1. Apertura (10 min)

**Decí esto:**

Hasta ahora el backend habla JSON. Postman entiende JSON. Un usuario normal, no.

Hoy no vamos a armar un frontend. Vamos a hacer dos cosas chicas:

1. El servidor **pinta HTML** (Handlebars).
2. El servidor **empuja cambios** sin que recarguen (Socket.io).

**Mostrá esto (completa):**

- http://localhost:8080/api/services → JSON  
- http://localhost:8080/services → la misma data, en HTML  

**Frase que se tienen que llevar:**  
*La API no se reemplaza. Las vistas son otra puerta al mismo manager.*

---

## 2. Handlebars en 15 minutos

**Analogía:** una carta modelo. `{{name}}` es el hueco. Express rellena y manda la carta.

Seguí `turnos-semana7-starter/LAB.md`. Orden fijo: motor → render → plantillas → httpServer → emit → browser.

**Hacé esto en el starter** (`src/app.js`):

1. Importá `engine` de `express-handlebars`.
2. `app.engine` / `view engine` / `views`.
3. `app.use("/", viewsRouter)`.
4. Entrá a http://localhost:8080/services.

Van a ver JSON con un `hint`. El router existe, todavía no renderiza.

**Abrí** `src/routes/views.router.js`.  
En `/services` cambiá `res.json` por `res.render("services", { title, services })`.

La vista está vacía. **Ahora** escriben `{{#each services}}` en `services.handlebars`.

**Mostrá** `src/views/layouts/main.handlebars` y `{{{body}}}`.

Si alguien pregunta por Mongo: *el official lo asume, nosotros seguimos con el JSON de las clases 3 y 4. El `res.render` no cambia el día que migremos.*

Seguí con detalle de servicio y de reserva (TODO 9 y 11). El booking hidrata el nombre a mano — eso el módulo 8 lo hace con `populate`.

---

## 3. El problema de F5 (5 min)

**Decí esto:**

Entrá a `/services`. Yo creo un servicio en Postman. La página no se entera. HTTP se cierra después de responder.

**Hacé la demo (completa o starter con vistas ya andando):**

1. Dejá `/services` abierto.  
2. Postman → **Crear servicio**.  
3. La página sigue igual. Recargá: ahora sí.

Ahí entra WebSockets: la conexión queda abierta.

---

## 4. Socket.io — el cable (20 min)

**Regla que escribí en el pizarrón / chat:**

| Quién | Cómo habla |
| --- | --- |
| Browser → server | `socket.emit` |
| Server → todos | `io.emit` |
| Server → uno | `socket.emit` |

**Error de oro (el quiz del PDF):**  
Handlebars **no** se vuelve a ejecutar cuando llega un socket. Handlebars ya se fue. El JS del browser toca el DOM.

**Hacé esto en el starter** (sin pegar la solución de una):

1. `src/server.js` — `createServer(app)` + `setupSocket` + `httpServer.listen`.  
   *Express solo no alcanza. Socket.io se cuelga del HTTP de Node.*
2. `src/config/socket.js` — al evento de alta: manager → `io.emit` de la lista.
3. Completá `emitServicesUpdated` (la API también tiene que avisar).
4. En `services.controller.js`, después de create / update / delete, llamala.

Si se traban, abrí el mismo archivo en `turnos-semana7-completa`.

---

## 5. El browser (15 min)

**Abrí** `src/views/realtime.handlebars`.  
Ellos agregan `{{#each}}` en la lista y los dos scripts:

```html
<script src="/socket.io/socket.io.js"></script>
<script src="/js/realtime.js"></script>
```

**Abrí** `src/public/js/realtime.js`. El form ya arma el objeto. Falta:

- `const socket = io()`
- `socket.emit` en el submit
- `socket.on` y pintar `#services-list`

No hace falta un HTML lindo. Un `<li>` por servicio alcanza.

---

## 6. La demo que cierra (10 min)

1. http://localhost:8080/realtime en **dos ventanas** (o dos browsers).  
2. En una, mandá el form. La otra se actualiza.  
3. Postman → **Crear servicio**. Las dos se actualizan.  
4. Postman → **Marcar no disponible**. El badge cambia sin F5.

Si algo no pinta: mirá la consola del browser y la terminal. El 90% es olvidar los `<script>` o seguir usando `app.listen`.

---

## 7. Cierre (5 min)

**Tres frases:**

1. `res.json` = datos. `res.render` = HTML. Conviven.  
2. Socket.io no reemplaza a la API: la API también emite cuando muta.  
3. Handlebars pinta el arranque. El socket pinta el después.

**Tarea sugerida:** que el form de `/realtime` también pueda marcar un servicio como no disponible (`updateService` + el mismo `servicesUpdated`).

---

## Machete si se corta el wifi / te perdés

| Quiero… | Archivo |
| --- | --- |
| Encender Handlebars | `src/app.js` |
| Elegir qué página | `src/routes/views.router.js` |
| HTML | `src/views/*.handlebars` |
| Encender sockets | `src/server.js` |
| Eventos del server | `src/config/socket.js` |
| Avisar después de Postman | `src/controllers/services.controller.js` |
| Eventos del browser | `src/public/js/realtime.js` |

Solución completa: carpeta hermana `turnos-semana7-completa`.
