import { Router } from "express";
import userController from "../controllers/userController.js";
import { validateToken, isAdmin, checkUserSession, validateUserSession } from "../middlewares/authMiddleware.js";

const router = Router();

// Register
router.post("/register", checkUserSession, userController.register);

// Login
router.post("/login", checkUserSession, userController.login);

// Logout
router.post('/logout', validateUserSession, userController.logout);

// Current - Protegida con validación del token
router.get('/current', validateUserSession, userController.current);

// Admin - Protegida con validación del token y autorización de admin
router.get('/admin', validateUserSession, isAdmin, userController.admin);

export default router;
