# Sistema de Turnos — Semana 8

Versión resuelta del laboratorio. La API lista servicios con filtro, paginación y orden; valida el request con Zod antes de tocar Mongo; y el detalle de una reserva trae el servicio hidratado con `populate`.

Handlebars y Socket.io siguen andando. No son el tema de esta semana.

## Cómo levantarlo

```bash
npm install
cp .env.example .env
```

En `.env` completá tu URI de Atlas. `MONGO_DB_NAME` puede quedar en `turnos_semana8`.

```bash
npm run seed
npm run dev
```

Queda en http://localhost:8080

`npm run seed` no borra el resto de la base: solo hace upsert de los datos de ejemplo (`semana8:*`). No se siembra solo al arrancar el server.

## Dónde mirar

| Tema | Archivos |
| --- | --- |
| Filtro, sort y páginas | `src/utils/service-query.js` → `src/dao/services.dao.js` |
| Zod (formato del request) | `src/validations/` + `src/middlewares/validate.middleware.js` |
| Populate | `src/dao/bookings.dao.js` → `findByIdPopulated` |
| Referencia en el modelo | `src/models/booking.model.js` (`ref: "services"`) |

Flujo de un request:

```
Cliente → Router → validate (Zod) → Controller → Service → Repository → DAO → Mongo
```

Zod chequea formato (email, ObjectId, `page`, `duration` numérico). Si el servicio no existe o no está disponible, eso lo resuelve el **service** (404 / 400), no el schema.

## Cómo probarlo

Las categorías del seed son `salud`, `estetica` y `bienestar` (minúscula, sin tilde). `/services` y `/api/services` usan el mismo query.

```
GET  /api/services?category=salud&available=true&page=1&limit=5&sortBy=price&order=asc
GET  /api/services?available=false
GET  /api/services?sort=desc
GET  /api/bookings/:bid
```

Vistas:

- http://localhost:8080/services?category=salud&available=true&page=1&limit=5
- http://localhost:8080/bookings
- http://localhost:8080/realtime

Casos que tienen que devolver **400** (no llegan a Mongo):

- crear servicio sin `name`
- `duration: "30"` (string; pide number)
- reserva con email `laura`
- `GET /api/services/1`
- `page=0` o `limit=100`

Un ObjectId de 24 hex que no existe → **404**. Eso no es Zod.

El listado `GET /api/bookings` sigue con ids. El detalle (`GET /api/bookings/:bid` y `/bookings/:bid`) popula `name`, `price`, `category`.

## Tests

```bash
npm test
```

Usa una base en memoria. No pisa Atlas.
