import express from "express";

import { orderData } from "../Controllers/order.controller.js";
import userMiddleware from "../Middleware/user.mid.js";

 
const router = express.Router();

router.post("/",userMiddleware, orderData);

export default router; 