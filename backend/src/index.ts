// Express application bootstrap.
import cors from "cors";
import dotenv from "dotenv";
import express, { ErrorRequestHandler } from "express";
import { MESSAGES } from "./constants/messages";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import leadRoutes from "./routes/lead.routes";
import { IHttpError } from "./types";

dotenv.config();

const PORT = process.env.PORT;

if (!PORT) {
  throw new Error(MESSAGES.PORT_MISSING);
}

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

const errorHandler: ErrorRequestHandler = (
  error: IHttpError,
  _req,
  res,
  _next
): void => {
  const statusCode = error.statusCode ?? error.status ?? 500;
  res.status(statusCode).json({
    message: error.message || MESSAGES.SERVER_ERROR,
  });
};

app.use(errorHandler);

const bootstrap = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(PORT);
  } catch {
    process.exit(1);
  }
};

void bootstrap();
