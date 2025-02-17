import express from "express";
import { createOrder, getAdminOrders } from "../controllers/payment.controller.js";  // `createOrder` fonksiyonunu import ediyoruz
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";  // Kullanıcı doğrulama

import User from "../models/user.model.js";

const router = express.Router();

// Sipariş oluşturma endpoint'i
router.post("/create-order", protectRoute, createOrder);
router.get("/orders", protectRoute, adminRoute, getAdminOrders);

export default router;

