# Temario completo — Backend I

Curso oficial: **Programación Backend I: Desarrollo Avanzado de Backend** (30 h, 9 módulos).  
Producto: sistema profesional de **turnos y reservas**.  
Formato de clase: el de Backend II — PPT corto + starter en vivo + completa de consulta + Postman.

Persistencia: semanas 3–4 y **7** usan FileSystem (lo que ya dimos). Semanas 5–6 migran a Mongo; la 7 no depende de Atlas para poder dictarse mañana.

---

## Semana 1 — Fundamentos de JavaScript Backend y Node.js

**Idea fuerza:** Node no es “JS en el server”. Es un runtime de un hilo + Event Loop + libuv.

- V8 vs libuv. Analogía del chef.
- Browser vs Node (`window` / `global`, no hay DOM, sí `fs` y `process`).
- Primer servidor con `http.createServer` (sin Express).
- Primer `ServiceManager` en un array (se pierde al matar el proceso).

**Salida:** un proceso que responde JSON en `:3000` y un manager en memoria.

---

## Semana 2 — Servidores con Express y API REST

**Idea fuerza:** Express es el `http` nativo, ordenado.

- `app.get/post/put/delete`, `req.params`, `req.query`, `req.body`.
- Códigos 200 / 201 / 400 / 404 / 500.
- Primeros endpoints de servicios.

**Salida:** API REST de servicios en memoria.

---

## Semana 3 — Persistencia con FileSystem

**Ya existe:** `chouse/backend-filesystem-turnos` + starter.

**Idea fuerza:** memoria se muere. El archivo JSON no.

- `fs.promises` + `async/await` + `try/catch → []`.
- `read → operar → write` (el write pisa el archivo entero).
- `ServiceManager`, `BookingManager`, `ProductManager`.

**Salida:** CRUD que sobrevive a `Ctrl+C`.

---

## Semana 4 — Routers, Controllers y organización

**Ya existe:** `chouse/backend-routers-controllers` + starter.

**Idea fuerza:** la ruta no habla con el archivo. El controller no arma el id.

```
Cliente → Router → Controller → Manager → JSON
```

- `express.Router()` montado en `/api/services` y `/api/bookings`.
- Reserva guarda `{ service: 2, quantity: 1 }`, no el objeto completo.

**Salida:** misma API, carpeta por responsabilidad.

---

## Semana 5 — Arquitectura en capas: DAO y Repository

**Calcar de:** `backend-2-arquitectura/Semana 8` (MeetOps DAO / DTO / Repository).

**Idea fuerza:** el controller no sabe si atrás hay un JSON o Mongo.

```
Route → Controller → Service → Repository → DAO → persistencia
```

- DAO habla con el archivo (después, con Mongoose).
- Repository no importa `fs` ni `mongoose`.
- DTO: no devolver campos internos de más.

**Salida:** mismos endpoints, capas intercambiables.

---

## Semana 6 — MongoDB Atlas y Mongoose

**Idea fuerza:** el DAO cambia. El repository y el controller no.

- Atlas + `MONGO_URL`.
- Schemas: `Service`, `Booking`, `Message`.
- El booking sigue guardando ids, no documentos embebidos enteros.

**Salida:** la API vive en la nube. FileSystem queda como recuerdo.

---

## Semana 7 — Handlebars y WebSockets

**Lista en esta carpeta.**

**Idea fuerza:** la API sigue siendo el núcleo. Las vistas son HTML. Los sockets empujan cambios sin F5.

1. Handlebars: `res.render` vs `res.json`. Layout + `{{#each}}`.
2. Router de vistas (`/services`, `/services/:sid`, `/bookings/:bid`) separado de `/api/*`.
3. Socket.io: `http.createServer(app)` — Express solo no alcanza.
4. Eventos: `createService` (cliente→server) y `servicesUpdated` (server→todos).
5. Error de oro: **Handlebars no re-renderiza por un socket.** El DOM lo toca el JS del browser.

**Salida:** tablero en `/realtime`. Postman crea un servicio → las dos ventanas se actualizan.

---

## Semana 8 — Consultas avanzadas, validación y populate  ← mañana

**Lista en esta carpeta.**

**Idea fuerza:** un endpoint profesional no es `find()`.

- Filtros `category` y `available` (incluido `false`), `sortBy`/`order`, paginación acotada.
- Metadata con el **count filtrado**.
- Zod en body/query/params. 400 de formato **antes** de Mongo.
- Existencia 404 y disponibilidad 400 viven en el service, no en Zod.
- Reserva guarda `{ service: ObjectId, quantity }`. Detalle con `populate('services.service')`.

**Salida:** `GET /api/services?category=salud&available=true&page=1` + booking hidratado.

---

## Semana 9 — Proyecto final

Integrar: Express + capas + Mongo + validación + Handlebars + Socket.io + populate.

Criterio de cierre: un compañero puede listar servicios en el browser, crear uno por socket, reservar por API y ver la reserva hidratada.

---

## Cómo se dicta cada semana (regla de Backend II)

1. 20–30 min de problema → idea fuerza (sin PPT largo).
2. Laboratorio sobre **starter** (`LAB.md` / `GUIA_DOCENTE.md`).
3. Comparar con **completa** + Postman / smoke.
4. Cerrar con 1 frase que se llevan.
