# Turnos — Semana 8 (COMPLETA)

Versión resuelta: filtros, paginación, Zod y populate.

## Setup

En esta máquina `.env` ya conecta a Atlas y los datos de ejemplo están cargados. No lo sobrescribas. Para una copia nueva, copiá `.env.example` solamente si no existe `.env` y configurá tu acceso remoto.

```bash
npm install
npm run seed
npm run dev
```

- http://localhost:8080
- http://localhost:8080/api/services?category=salud&available=true&page=1&limit=5
- http://localhost:8080/bookings  (detalle con populate)
- http://localhost:8080/realtime  (sigue andando; no es el tema)

```bash
npm test
```

No hay auto-seed al arrancar. `npm run seed` es upsert por `seedKey` de clase: no borra el resto de la base.
