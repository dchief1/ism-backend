import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { connectDatabase } from "./config/database";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes"

// Establish connection to DB
connectDatabase();

const app = express();

// Set HTTP security headers
app.use(helmet());

// CORS middleware
app.use(cors());

// Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(bodyParser.json())

// Routes middleware
app.use("/api/users", userRoutes)

// Routes
app.get("/", (req, res) => {
    res.send("Home Page")
})

export default app;