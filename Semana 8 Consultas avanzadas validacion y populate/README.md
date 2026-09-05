# Semana 8 — Consultas, validación y populate

La API ya habla con Mongo. Esta semana se completa filtro, paginación, Zod y `populate`.

Handlebars y Socket.io ya andan. No son el tema.

## Carpetas

| Qué | Path |
| --- | --- |
| Laboratorio | `turnos-semana8-starter/` · instrucciones en `LAB.md` |
| Referencia | `turnos-semana8-completa/` |
| Postman | `postman/Consultas-Validacion-Populate.postman_collection.json` |

## Levantar la referencia

```bash
cd turnos-semana8-completa
cp .env.example .env   # completá MONGO_URL
npm install
npm run seed
npm run dev
```

- http://localhost:8080/services?category=salud&available=true&page=1&limit=5
- http://localhost:8080/api/services?category=salud&available=false
- http://localhost:8080/bookings
- http://localhost:8080/realtime

```bash
npm test
```

Categorías del seed: `salud`, `estetica`, `bienestar`.
