"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const database_1 = require("./config/database");
const body_parser_1 = __importDefault(require("body-parser"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
const errorMiddleware_1 = __importDefault(require("./middlewares/errorMiddleware"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
// Establish connection to DB
(0, database_1.connectDatabase)();
const app = (0, express_1.default)();
// Set HTTP security headers
app.use((0, helmet_1.default)());
// CORS middleware
app.use((0, cors_1.default)());
// Middlewares
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "uploads")));
// Routes middleware
app.use("/api/users", userRoutes_1.default);
app.use("/api/products", productRoutes_1.default);
app.use("/api/contactus", contactRoutes_1.default);
// Routes
app.get("/", (req, res) => {
    res.send("Home Page");
});
// Error Middleware
app.use(errorMiddleware_1.default);
exports.default = app;
