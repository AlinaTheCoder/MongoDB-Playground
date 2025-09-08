import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logout,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);
router.post("/logout", authMiddleware, logout);

export default router;
