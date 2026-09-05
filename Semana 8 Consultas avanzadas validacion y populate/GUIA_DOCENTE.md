# Guía docente — Semana 8 (120 min)

Producto: Sistema de Turnos.  
Tema: un endpoint profesional no es `find()`.  
No es tema: Handlebars ni Socket.io (ya andan; se usan de control).

Material: starter a la izquierda, completa a la derecha. Postman importado. Atlas ya configurado en ambos `.env`, con bases separadas y datos de ejemplo. Completa en puerto 8080 y starter en 8081. Conservá esos `.env`. `npm run seed` **antes** de la clase si necesitás restaurar los ejemplos, no al arrancar el server.

## Antes de entrar (10 min, vos solo)

La colección Postman incluye aserciones y captura automática de identificadores. Ejecutá todas las carpetas en orden con Collection Runner sobre la completa. Última verificación: 34 solicitudes y 56 aserciones aprobadas, usando una base Atlas de pruebas separada. La ejecución manual crea datos de demostración; no es necesario ejecutarla repetidamente sobre los datos de la clase. Los 28 tests de la completa también pasaron.

El starter conserva los ejercicios sin resolver: los tests de filtros, validación y populate son objetivos a alcanzar, no una condición del punto de partida. Las instrucciones están en esta guía y en el LAB; el código no contiene comentarios docentes.

```bash
cd turnos-semana8-completa
npm install
npm run seed
npm test
npm run dev
```

Checklist:

- [ ] `GET /health` → Semana 8
- [ ] `GET /api/services?available=false` → manicura y masaje
- [ ] `GET /api/bookings` → Laura y Martín; el detalle de Laura trae `service.name`
- [ ] `/realtime` abre
- [ ] No hay URI ni password en la consola
- [ ] Semana 7 intacta

Para arrancar el starter abrí otra terminal en `turnos-semana8-starter` y ejecutá `npm run dev`; usá http://localhost:8081. En Postman cambiá `baseUrl` entre http://localhost:8080 (solución) y http://localhost:8081 (alumnos). No hace falta copiar ni modificar credenciales.

La aplicación usa Atlas. La suite `npm test` usa una base efímera de pruebas mediante mongodb-memory-server; puede descargar un binario en su primer uso. No requiere instalar ni configurar MongoDB o Docker. Si Atlas no responde, podés explicar el código y ejecutar esa suite; la demo conectada requiere recuperar la conexión.

## Min 0–10 — El `find()` no alcanza

Problema en el pizarrón:

```
GET /api/services
```

devuelve todo. Una reserva muestra `65f1...` en vez de “Consulta clínica”.

Frase: **filtro / página / validación / populate**. Tres huecos, no una migración.

Mostrar el starter: Mongo, capas y vistas ya están. Los puntos a completar están indicados en el LAB, sin instrucciones docentes dentro del código.

## Min 10–45 — Consultas

Dictar en vivo sobre el starter:

1. `available=false` se come si escriben `if (available)`.
2. `skip = (page - 1) * limit`.
3. `countDocuments(filter)` con el **mismo** filtro.
4. `sortBy` + `order`. De yapa, `sort=asc|desc` ⇒ price.

Abrir Postman:

- `category=salud&page=1&limit=5&sortBy=price&order=asc`
- `available=false`
- `sort=desc`

Si alguien pagina sobre el total de la colección, el metadata miente. Corregirlo en público.

## Min 45–75 — Zod

Pizarrón:

| Formato (Zod) | Negocio (service) |
| --- | --- |
| falta name, email malo, id `1` | no existe → 404 |
| `page=0`, `limit=100` | no disponible → 400 |
| 400 **antes** de Mongo | no se toca la base |

Orden: esquemas primero, `safeParse` después. Si activan el middleware con `z.object({})`, el body se vacía.

Casos en vivo (Postman carpeta Errores):

1. Crear servicio sin name → 400, `count` no sube
2. `duration: "30"` → 400
3. Reserva con email `laura` → 400
4. `GET /api/services/1` → 400
5. ObjectId de 24 que no existe → 404

Frase: **Zod no pregunta si el servicio existe.**

## Min 75–100 — Populate

Modelo ya tiene `ref: 'services'`. La reserva guarda `{ service, quantity }`.

Completar `findByIdPopulated`. Select de campos. No hidratar el listado.

Demo:

1. Detalle de Laura en Postman: `service.name`, `price`, sin `seedKey`
2. Browser `/bookings/:id` — el helper `isPopulatedService` deja de mostrar el ObjectId
3. `GET /api/bookings` sigue con ids

Si alguien embebe el servicio entero al guardar: parar. Populate es para **consultar**.

## Min 100–115 — Cierre de demo

1. Postman: página 2 filtrada
2. Postman: 400 de Zod
3. Postman: reserva hidratada
4. Dos ventanas `/realtime` + crear por socket (regresión semana 7)

Comparar con la completa solo si se traban. No proyectar la solución entera.

## Min 115–120 — Una frase

> El controller no valida a mano, el DAO no pagina “toda la colección”, y la reserva no guarda el servicio: lo **popula** cuando hace falta.

## Plan B

- Atlas caído: tests de la completa + Postman contra localhost si alguien tiene URI; si no, dictar código y dejar demo remota para el after.
- Se atrasan: cortar sort de compatibilidad; no tocar `$lookup`.
- Se adelantan: `select` dentro de populate y por qué `z.coerce.boolean()` rompe `available=false`.

## Qué no hacer

- No `dropDatabase` ni borrar colecciones ajenas
- No auto-seed en `server.js`
- No Mongo local ni Docker
- No imprimir `MONGO_URL`
- No cambiar el producto a e-commerce / red social
- No convertir la clase en un taller de Handlebars
