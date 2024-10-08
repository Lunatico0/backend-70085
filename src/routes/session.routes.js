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
const registerRedirect = `<!DOCTYPE html>
        <html lang="es" class="dark">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="shortcut icon" href="/img/favCircle.png" type="image/x-icon">
          <script src="https://cdn.tailwindcss.com"></script>
          <title>Artemisa-DB</title>
        </head>
        <body class="flex flex-col justify-between items-center h-screen w-screen bg-slate-900">
            <h2 class="text-white text-5xl font-semibold pt-40">User not found. Redirecting to register in 3 seconds...</h2>
          <footer class="mt-20">
            <h2 class="pb-10 text-white">Muchas gracias. Patricio Pittana</h2>
          </footer>
        </body>
        <script>
          setTimeout(() => {
            window.location.href = '/register';
          }, 3000);
        </script>
        </html>`;
const loginRedirect = `<!DOCTYPE html>
        <html lang="es" class="dark">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="shortcut icon" href="/img/favCircle.png" type="image/x-icon">
          <script src="https://cdn.tailwindcss.com"></script>
          <title>Artemisa-DB</title>
        </head>
        <body class="flex flex-col justify-between items-center h-screen w-screen bg-slate-900">
            <h2 class="text-white text-5xl font-semibold pt-40">User not authenticated. Redirecting to login in 3 seconds...</h2>
          <footer class="mt-20">
            <h2 class="pb-10 text-white">Muchas gracias. Patricio Pittana</h2>
          </footer>
        </body>
        <script>
          setTimeout(() => {
            window.location.href = '/login';
          }, 3000);
        </script>
        </html>`;

// Register
router.post("/register", async (req, res) => {
  const token = req.cookies['token'];
  if (token) {
    jwt.verify(token, jwtSecret);
    return res.redirect('/api/sessions/current');
  }

  const { name, lastName, email, password, age } = req.body;

  try {
    const userExists = await UserModel.findOne({ email });

    if (userExists) {
      return res.status(400).send("User already exists");
    }

    const newUser = await UserModel.create({
      name,
      lastName,
      email,
      password: createHash(password),
      age
    });

    if (!newUser.cart) {
      const newCart = await manager.addCart();
      newUser.cart = newCart._id;
      await newUser.save();
    }

    const token = jwt.sign(
      { name: newUser.name, lastName: newUser.lastName, email: newUser.email, age: newUser.age, cart: newUser.cart },
      jwtSecret,
      { expiresIn: "1h" }
    );

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

  if (req.user && req.user.role == 'admin') {
    return res.redirect('/realTimeProducts')
  }

  const token = req.cookies['token'];
  if (token) {
    jwt.verify(token, jwtSecret);
    return res.redirect('/api/sessions/current');
  }

  const { email, password } = req.body;

  try {
    const foundUser = await UserModel.findOne({ email });

    if (!foundUser) {
      return res.status(401).send(registerRedirect);
    }

    if (!isValidPassword(password, foundUser)) {
      return res.status(401).send("Invalid password");
    }

    if (!foundUser.cart) {
      const newCart = await manager.addCart();
      foundUser.cart = newCart._id;
      await foundUser.save();
    }

    const token = jwt.sign(
      { name: foundUser.name, lastName: foundUser.lastName, role: foundUser.role, email: foundUser.email, age: foundUser.age, cart: foundUser.cart },
      jwtSecret,
      { expiresIn: "1h" }
    );

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 3600000,
    }).redirect('/api/sessions/current');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Logout
router.post('/logout', async (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

// Current
router.get('/current', (req, res, next) => {
  passport.authenticate('current', { session: false }, async (err, user, info) => {
    if (err) {
      return res.status(401).json({
        status: 'error',
        message: 'Error en la autenticación de JWT.',
        details: err.message,
        solution: 'Revisa la implementación de JWT en el servidor.'
      });
    }

    if (!user) {
      return res.status(401).send(loginRedirect);
    }

    req.user = user;

    try {
      const cart = await manager.getCartById(user.cart);
      res.render('profile', {
        user,
        cart
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error al obtener el perfil y carrito.',
        details: error.message,
        solution: 'Verifica la conexión a la base de datos y el estado del usuario.'
      });
    }
  })(req, res, next);
});

// Admin
router.get('/admin', passport.authenticate('current', { session: false }), async (req, res) => {
  if (req.user.role !== 'admin') res.status(403).send('No eres Admin!');
  console.log(req.cookies['token']);

  res.render('realTimeProducts', { user: req.user });
})

// Home products
router.get('/', (req, res, next) => {
  passport.authenticate('current', { session: false }, async (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(100).json({ message: 'Unauthenticated' });
    }
    req.user = user;
    const cart = await manager.getCartById(req.user.cart);
    return res.send({ user: req.user, cart: cart });
  })(req, res, next);
});

// Carrito
router.get('/cart', passport.authenticate('current', { session: false }), async (req, res) => {
  const cart = await manager.getCartById(req.user.cart);
  res.render('cart', { cartId: req.user.cart, products: cart.products });
})

export default router;
