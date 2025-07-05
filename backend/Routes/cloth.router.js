import express from "express";
import { buyCloth, createCloth,  deleteCloth,  getCloths, getOneCloth, updateCloth } from "../Controllers/cloth.controller.js";
import userMiddleware from "../Middleware/user.mid.js";
import adminMiddleware from "../Middleware/admin.mid.js";
const router = express.Router();

router.post("/create",adminMiddleware, createCloth);
router.put("/update/:clothId",adminMiddleware, updateCloth);
router.delete("/delete/:clothId",adminMiddleware, deleteCloth);
router.get("/cloths", getCloths);
router.get("/:clothId", getOneCloth);
router.post("/buy/:clothId",userMiddleware, buyCloth);

export default router;