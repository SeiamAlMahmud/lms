import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import routes from "./routes";
import { errorHandler } from "./shared/middleware/errorHandler";
import { notFound } from "./shared/middleware/notFound";
import { globalRateLimiter } from "./shared/middleware/rateLimit";

const app = express();

const allowedOrigins = env.FRONTEND_URL.split(",").map((origin) => origin.trim());

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(morgan("combined"));
app.use(globalRateLimiter);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "LMS backend is running",
  });
});

app.use("/api/v1", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
