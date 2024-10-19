import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import CartManager from "../DAO/db/cartManagerDb.js"
import configObject from "../config/general.config.js";
const { jwtSecret } = configObject;

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);

const generateToken = (userId) => {
  return jwt.sign( { userId } , jwtSecret, { expiresIn: '1h' });
};

const assignCartToUser = async (user) => {
  const manager = new CartManager();
  if (!user.cart) {
    try {
      const newCart = await manager.addCart();
      user.cart = newCart._id;
      await user.save();
    } catch (error) {
      console.error("Error al guardar el carrito al usuario:", error);
    }
  }
  return user;
};

const verifyToken = (token) => {
  if (token) {
    try {
      jwt.verify(token, jwtSecret);
      return true;
    } catch {
      return false;
    };
  };
};

export {createHash, isValidPassword, generateToken, assignCartToUser, verifyToken};
