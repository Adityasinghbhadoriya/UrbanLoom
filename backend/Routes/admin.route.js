import express from "express";
import { login, logout, Signup } from "../Controllers/admin.controller.js";
const router = express.Router();

router.post("/signup", Signup);
router.post("/login", login);
router.get("/logout", logout);

export default router;