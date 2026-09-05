# Semana 8 — Consultas avanzadas, validación y populate

Clase en vivo. Producto: **Sistema de Turnos**.

Handlebars y Socket.io ya se dieron: siguen andando como base. Hoy no son el tema.

## Entregables

| Item | Path |
| --- | --- |
| **Cómo dictar** | `GUIA_DOCENTE.md` |
| **Laboratorio** | `turnos-semana8-starter/LAB.md` |
| **Starter (para clase)** | `turnos-semana8-starter/` |
| **Completa (solución)** | `turnos-semana8-completa/` |
| **Postman** | `postman/Consultas-Validacion-Populate.postman_collection.json` |

Temario del curso: `../TEMARIO.md`. Programa oficial: módulo 8, págs. 204–232.

## Ritmo (2 h)

1. El `find()` no alcanza (10 min)
2. Filtros + paginación + sortBy/order (35 min)
3. Zod en el borde HTTP (30 min)
4. Referencias y populate (25 min)
5. Demo Postman + vistas (15 min)
6. Cierre (5 min)

## Setup rápida (completa)

En esta máquina ambos `.env` ya están configurados y las bases remotas tienen datos de ejemplo. Conservá esos archivos. Completa: puerto 8080; starter: puerto 8081, con una base separada. Para una copia nueva, creá `.env` desde `.env.example` únicamente si todavía no existe y configurá tu acceso Atlas.

```bash
cd turnos-semana8-completa
npm install
npm run seed
npm run dev
```

```bash
npm test
```

- http://localhost:8080/api/services?category=salud&available=false&page=1&limit=5
- http://localhost:8080/bookings
- http://localhost:8080/realtime
