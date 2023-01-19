import { Router } from "express";
import UserController from "../controllers/userController";

const router = Router();

const { registerUser, loginUser, logout } = new UserController()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/logout", logout)

export default router;