import { Router } from "express";
import { createHash , isValidPassword } from "../utils/util.js"
import { config } from "dotenv";
import UserModel from "../dao/models/user.model.js";
import jwt from "jsonwebtoken";
import passport from "passport";
config();
const router = Router();
const jwtSecret = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
  const { name, lastName, email, password, age } = req.body;

  try {
    const userExists = await UserModel.findOne({ email });

    if (userExists) {
      return res.status(400).send("User already exists");
    }

    const newUser = await UserModel.create({ name, lastName, email, password: createHash(password), age })

    const token = jwt.sign({ name: newUser.name, lastName: newUser.lastName, email: newUser.email, age: newUser.age }, jwtSecret, { expiresIn: "1h"});

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60,
    }).redirect('/api/sessions/current');

  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const foundUser = await UserModel.findOne({ email });

    if (!foundUser) {
      return res.status(401).send("User not found");
    }

    if (!isValidPassword(password, foundUser)) {
      return res.status(401).send("Invalid password");
    }

    const token = jwt.sign({ name: foundUser.name, lastName: foundUser.lastName, role: foundUser.role, email: foundUser.email, age: foundUser.age }, jwtSecret, { expiresIn: "1h"});

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 60 * 60,
    }).redirect('/api/sessions/current');

  } catch (error) {
    res.status(500).send(error);
  }
})

// Logout
router.post('/logout', async (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

// Current
router.get('/current', passport.authenticate('current', { session: false }), async (req, res) => {
  res.render('profile', {user: req.user})
})

// Admin
router.get('/admin', passport.authenticate('current', { session: false }), async (req, res) => {
  if(req.user.role !== 'admin') res.status(403).send('No eres Admin!')
  res.render('realTimeProducts', {user: req.user})
})

export default router;
