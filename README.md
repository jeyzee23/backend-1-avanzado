# Backend I — Sistema de Turnos

Proyectos de práctica del curso. Cada semana tiene un **starter** para completar y una versión **completa** de referencia.

Producto: API y vistas de un sistema de turnos (servicios + reservas).

## Semanas

| Semana | Tema | Carpeta |
| --- | --- | --- |
| 7 | Handlebars y WebSockets | `Semana 7 Vistas Handlebars y WebSockets/` |
| 8 | Consultas, validación Zod y populate | `Semana 8 Consultas avanzadas validacion y populate/` |

## Arrancar Semana 8 (referencia)

```bash
cd "Semana 8 Consultas avanzadas validacion y populate/turnos-semana8-completa"
cp .env.example .env
```

Completá `MONGO_URL` con tu cluster de Atlas. Después:

```bash
npm install
npm run seed
npm run dev
```

- http://localhost:8080
- http://localhost:8080/services?category=salud
- http://localhost:8080/api/services?category=salud&available=true&page=1&limit=5
- http://localhost:8080/bookings
- http://localhost:8080/realtime

El starter de la misma semana se levanta igual, en el puerto 8081 si dejás ese `PORT` en su `.env`.

## Notas

- No commitees `.env`.
- `npm run seed` carga ejemplos (`semana8:*`) y no borra el resto de la base.
- Hay una colección Postman en cada carpeta de semana.
