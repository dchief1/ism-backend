import { Router } from "express";
import ContactController from "../controllers/contactController";
import protect from "../middlewares/authMiddleware";

const router = Router();

const { contactUs } = new ContactController();

router.post("/", protect, contactUs);

export default router;
