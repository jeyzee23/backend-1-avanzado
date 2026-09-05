# Semana 8 — Starter

Mongo, modelos, capas, Handlebars y Socket.io ya están. Completá **tres** huecos:

1. Filtros, paginación y sort → `src/utils/service-query.js` + `ServicesDAO.findPaginated`
2. Zod → `src/validations/` + `src/middlewares/validate.middleware.js`
3. Populate → `BookingsDAO.findByIdPopulated`

Seguí [`LAB.md`](./LAB.md). Referencia: [`../turnos-semana8-completa`](../turnos-semana8-completa).

## Setup

```bash
cp .env.example .env   # completá MONGO_URL
npm install
npm run seed
npm run dev
```

Por defecto queda en http://localhost:8081 si ponés `PORT=8081` en el `.env`.

- http://localhost:8081/api/services
- http://localhost:8081/bookings
- http://localhost:8081/realtime

```bash
npm test
```

Los tests de filtro, validación y populate empiezan en rojo hasta que completes el lab.

`npm run seed` solo hace upsert de las claves `semana8:*`.
