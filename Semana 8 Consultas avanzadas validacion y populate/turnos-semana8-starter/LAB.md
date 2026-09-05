# Laboratorio — orden de la clase

La API ya habla con Mongo. Las capas ya están. Handlebars y Socket.io ya andan.

Hoy no migres nada. Completá **tres** huecos. Abrí este repo a la izquierda y `../turnos-semana8-completa` a la derecha. Copiá de a un bloque.

```
Cliente → Router → validate (Zod) → Controller → Service → Repository → DAO → Mongo
```

Existencia y disponibilidad ya viven en el service. Zod no las reemplaza.

## 1. Consultas: filtro, página, orden

`src/utils/service-query.js`

- `buildServiceFilter`: `category` y `available` (incluido `false`)
- `buildSort`: `sortBy` + `order`
- `applySortCompatibility`: `sort=asc|desc` ⇒ `price`
- `buildPageMetadata`: `totalDocs` **filtrado**, pages y links

`src/dao/services.dao.js` → `findPaginated`

- `find(filter).sort().skip().limit()`
- `countDocuments(filter)` con el **mismo** filtro

Probar:

```
GET /api/services?category=salud&available=true&page=1&limit=5&sortBy=price&order=asc
GET /api/services?available=false
GET /api/services?sort=desc
```

## 2. Zod en el borde HTTP

`src/validations/service.validation.js`  
`src/validations/booking.validation.js`  
`src/validations/common.validation.js`

Después, y no antes, `src/middlewares/validate.middleware.js`:

- `safeParse`
- `400` + `details` si falla
- guardar en `req.validatedBody` / `Query` / `Params`

Rutas ya montan `validate(...)`. Crear/actualizar servicio, crear reserva, agregar servicio, query y params.

Probar a propósito:

- body sin `name` → 400, no se crea
- `duration: "30"` → 400
- email inválido → 400
- `GET /api/services/1` → 400
- `page=0` o `limit=100` → 400
- ObjectId bien formado que no existe → 404 (eso no es Zod)

## 3. Populate

`src/dao/bookings.dao.js` → `findByIdPopulated`

```
.populate('services.service', 'name description duration price category available')
```

La reserva sigue guardando `{ service: ObjectId, quantity }`.

Probar:

- `GET /api/bookings/:bid` → `service.name`
- `/bookings/:bid` en el browser → deja de mostrar el ObjectId crudo
- `GET /api/bookings` (listado) sigue sin hidratar

## Demo que cierra

1. Postman: filtro `available=false` + página 2
2. Postman: crear servicio inválido → 400
3. Postman: crear reserva + agregar servicio → detalle con nombre y precio
4. Dos ventanas en `/realtime` (regresión: sockets siguen vivos)
