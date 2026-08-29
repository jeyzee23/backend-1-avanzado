import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import servicesRouter from "./routes/services.router.js";
import bookingsRouter from "./routes/bookings.router.js";
import viewsRouter from "./routes/views.router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Starter Semana 7 — falta Handlebars y sockets" });
});

app.use("/api/services", servicesRouter);
app.use("/api/bookings", bookingsRouter);

// 1. Configurar express-handlebars (engine + view engine + carpeta views)
// 2. Montar viewsRouter en "/"

export default app;
