import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { connectDatabase } from "./config/database";

// Establish connection to DB
connectDatabase();

const app = express();

// Set HTTP security headers
app.use(helmet());

// CORS middleware
app.use(cors());

export default app;