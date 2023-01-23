import { Router } from "express";
import UserController from "../controllers/userController";
import protect from "../middlewares/authMiddleware";

const router = Router();

const { registerUser, loginUser, logout, getUser, loginStatus, updateUser, changePassword } = new UserController()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/logout", logout)
router.get("/getuser", protect, getUser)
router.get("/loggedin",  loginStatus)
router.patch("/updateuser", protect, updateUser)
router.patch("/changepassword", protect, changePassword)

export default router;