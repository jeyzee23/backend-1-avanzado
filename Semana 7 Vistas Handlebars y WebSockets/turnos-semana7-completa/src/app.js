import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { engine } from "express-handlebars";
import servicesRouter from "./routes/services.router.js";
import bookingsRouter from "./routes/bookings.router.js";
import viewsRouter from "./routes/views.router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.engine(
  "handlebars",
  engine({
    helpers: {
      eq: (a, b) => a === b,
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Servidor activo — Semana 7" });
});

app.use("/api/services", servicesRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/", viewsRouter);

export default app;
