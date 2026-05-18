import cors from "cors";
import dotenv from "dotenv";
import express, { ErrorRequestHandler } from "express";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import leadRoutes from "./routes/lead.routes";

dotenv.config();

interface HttpError extends Error {
  status?: number;
  statusCode?: number;
}

const PORT = process.env.PORT;

if (!PORT) {
  throw new Error("PORT is not configured");
}

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

const errorHandler: ErrorRequestHandler = (error: HttpError, _req, res, _next) => {
  const statusCode = error.statusCode ?? error.status ?? 500;
  res.status(statusCode).json({
    message: error.message || "Internal server error",
  });
};

app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error(error.message);
    process.exit(1);
  });
