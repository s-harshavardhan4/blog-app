import express from "express";
import { signup, login, getProfile } from "../controller/userController";
import auth from "../middleware/auth";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", auth, getProfile);

export default router;
