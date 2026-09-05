# Backend I — Desarrollo Avanzado con Node.js

Material docente para clases en vivo. Producto del curso: **Sistema de Turnos y Reservas**.

Misma organización que Backend II (`backend-2-arquitectura`): una carpeta por semana, **starter + completa**, Postman y guía para dictar.

## Temario (9 módulos = 9 semanas)

| Semana | Módulo oficial | Qué sale el alumno sabiendo | Material en `chouse` |
| --- | --- | --- | --- |
| 1 | Fundamentos JS Backend y Node.js | Event Loop, `http` nativo, primer `ServiceManager` en memoria | Pendiente |
| 2 | Servidores con Express y API REST | Request/response, rutas, params, body, códigos HTTP | Pendiente |
| 3 | Persistencia inicial con FileSystem | `fs.promises`, JSON, CRUD que sobrevive al restart | `../backend-filesystem-turnos` + starter |
| 4 | Routers, Controllers y organización | `routes → controllers → managers` | `../backend-routers-controllers` + starter |
| 5 | Arquitectura en capas: DAO y Repository | Desacoplar negocio de persistencia (como Semana 8 de Backend II) | Pendiente — calcar `backend-2-arquitectura/Semana 8` |
| 6 | MongoDB Atlas y Mongoose | Schemas de services, bookings y messages | Pendiente |
| 7 | Vistas con Handlebars y WebSockets | SSR + Socket.io, tablero en vivo | `Semana 7 Vistas Handlebars y WebSockets/` |
| **8** | **Consultas avanzadas, validación y populate** | Filtros, paginación, Zod, populate | **Esta carpeta — lista para mañana** |
| 9 | Proyecto final | API completa + vistas + real-time + populate | Pendiente |

El programa oficial está en `~/Desktop/program-summary.pdf`.

## Semana 8 (prioridad — clase de mañana)

```
Semana 8 Consultas avanzadas validacion y populate/
  GUIA_DOCENTE.md              ← leé esto para dictar
  turnos-semana8-starter/      ← lo que abrís en vivo
  turnos-semana8-completa/     ← demo resuelta
  postman/                     ← casos buenos y 400/404
```

```bash
cd "Semana 8 Consultas avanzadas validacion y populate/turnos-semana8-completa"
cp .env.example .env   # Codex completa MONGO_URL (Atlas)
npm install
npm run seed
npm run dev
# http://localhost:8080/api/services?category=salud&available=false
# http://localhost:8080/bookings
```

Semana 7 queda en `Semana 7 Vistas Handlebars y WebSockets/` (no la toques).
