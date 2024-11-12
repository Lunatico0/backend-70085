import { Router } from "express";
import passport from "passport";
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

// Google Authentication
router.get("/google", passport.authenticate('google', { scope: ['email', 'profile'] }));

// Callback de Google
router.get("/googlecallback", passport.authenticate('google'), userController.googleCallback);

// GitHub Authentication
router.get("/github", passport.authenticate('github', { scope: ['user:email'] }));

// Callback de GitHub
router.get("/githubcallback", passport.authenticate('github'), userController.githubCallback);

export default router;
