import { Router } from "express";
import UserController from "../controllers/userController";

const router = Router();

const { registerUser, loginUser } = new UserController()

router.post("/register", registerUser)
router.post("/login", loginUser)

export default router;