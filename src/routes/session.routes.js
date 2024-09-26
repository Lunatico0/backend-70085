import { Router } from "express";
import { createHash, isValidPassword } from "../utils/util.js"
import { config } from "dotenv";
import CartManager from "../dao/db/cartManagerDb.js";
import UserModel from "../dao/models/user.model.js";
import jwt from "jsonwebtoken";
import passport from "passport";
config();
const router = Router();
const jwtSecret = process.env.JWT_SECRET;
const manager = new CartManager();

router.post("/register", async (req, res) => {
  const { name, lastName, email, password, age } = req.body;

  try {
    const userExists = await UserModel.findOne({ email });

    if (userExists) {
      return res.status(400).send("User already exists");
    }

    const newUser = await UserModel.create({ name, lastName, email, password: createHash(password), age })

    if (!newUser.cart) {
      const newCart = await manager.addCart();
      newUser.cart = newCart._id;
      await newUser.save();
    }

    const token = jwt.sign({ name: newUser.name, lastName: newUser.lastName, email: newUser.email, age: newUser.age }, jwtSecret, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000,
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

    if (!foundUser.cart) {
      const newCart = await manager.addCart();
      foundUser.cart = newCart._id;
      await foundUser.save();
    }

    const token = jwt.sign({ name: foundUser.name, lastName: foundUser.lastName, role: foundUser.role, email: foundUser.email, age: foundUser.age, cart: foundUser.cart }, jwtSecret, { expiresIn: "1h" });

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 3600000,
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
  if (!req.user) {
    return res.redirect('/login'); // Redirige a /login si no hay usuario autenticado
  }
  try {
    const cart = await manager.getCartById(req.user.cart); // Obtener el carrito del usuario
    res.render('profile', { user: req.user, cart: cart }); // Renderizar la vista del perfil con la info del usuario
  } catch (error) {
    res.status(500).send("Error al obtener el perfil");
  }
})

// Admin
router.get('/admin', passport.authenticate('current', { session: false }), async (req, res) => {
  if (req.user.role !== 'admin') res.status(403).send('No eres Admin!');
  console.log(req.cookies['token']);

  res.render('realTimeProducts', { user: req.user });
})

router.get('/', (req, res, next) => {
  passport.authenticate('current', { session: false }, async (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(100).json({ message: 'Unauthenticated' });
    }
    req.user = user;
    const cart = await manager.getCartById(req.user.cart)
    return res.send( { user: req.user, cart: cart });
  })(req, res, next);
});

router.get('/cart', passport.authenticate('current', { session: false }), async (req, res) => {
  const cart = await manager.getCartById(req.user.cart);
  res.render('cart', { cartId: req.user.cart, products: cart.products });
})

export default router;
