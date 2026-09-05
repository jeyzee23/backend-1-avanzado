# Turnos — Semana 8 (STARTER)

Mongo, modelos, capas, Handlebars y Socket.io ya están. Hoy se completan **tres** huecos.

1. Filtros / paginación / sort → `src/utils/service-query.js` + `ServicesDAO.findPaginated`
2. Zod → `src/validations/*` + `src/middlewares/validate.middleware.js`
3. Populate → `BookingsDAO.findByIdPopulated`

Seguí [`LAB.md`](./LAB.md). Solución: `../turnos-semana8-completa`.

## Setup

En esta máquina `.env` ya conecta a una base Atlas separada, con datos de ejemplo y puerto 8081. No lo sobrescribas. Para una copia nueva, creá `.env` desde `.env.example` solamente si aún no existe y configurá tu acceso remoto.

```bash
npm install
npm run seed
npm run dev
```

- http://localhost:8081
- http://localhost:8081/api/services
- http://localhost:8081/bookings  (el detalle muestra ObjectId hasta populate)
- http://localhost:8081/realtime

```bash
npm test
```

En el starter los tests de los 3 temas empiezan en rojo. En la completa están verdes.

No hay auto-seed al arrancar. `npm run seed` solo hace upsert de las claves `semana8:*`.
