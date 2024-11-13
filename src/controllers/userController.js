import userServices from "../services/userServices.js";
import CartManager from "../dao/db/cartManagerDb.js";
import userDTO from "../DTO/userDto.js"
import { assignCartToUser, generateToken } from "../utils/util.js";

const manager = new CartManager();

class UserController {
  async register(req, res) {
    const { name, lastName, email, password, age } = req.body;
    try {
      const newUser = await userServices.registerUser({ name, lastName, email, password, age });
      const userWithCart = await assignCartToUser(newUser);
      const token = generateToken(userWithCart._id);

      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      });

      if (!req.session) {
        req.session = {};
      }

      req.session.user = userWithCart;

      res.redirect('/profile');

    } catch (error) {
      res.status(400).send(error.message);
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await userServices.loginUser(email, password);
      const userWithCart = await assignCartToUser(user);
      const token = generateToken(userWithCart._id);
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      });

      if (!req.session) {
        req.session = {};
      }

      req.session.user = userWithCart;
      res.redirect('/profile');
    } catch (error) {
      res.status(401).render('login', {
        error: 'Credenciales incorrectas',
        email
      });
    }
  }

  async logout(req, res) {
    res.clearCookie('token');
    res.redirect('/login');
  }

  async current(req, res) {
    try {
      const user = req.user;
      const userDto = new userDTO(user);
      const cart = await manager.getCartById(user.cart);
      res.json({ user: userDto, cart });
    } catch (error) {
      res.status(501).json({
        status: 'error',
        message: 'Error al obtener el perfil y carrito.',
        details: error.message
      });
    }
  }

  async admin(req, res) {
    let user = req.user;
    if (user.role !== 'admin') {
      return res.status(403).send('No eres Admin!');
    }
    if(!user.cart){
      user = await assignCartToUser(user)
    }
    // res.render('realTimeProducts', { user });
    res.redirect('/realTimeProducts');
  }

  async googleCallback(req, res) {
    res.redirect('/profile');
  }

  async githubCallback(req, res) {
    res.redirect('/profile');
  }
}

export default new UserController();
