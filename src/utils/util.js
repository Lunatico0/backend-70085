import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import configObject from "../config/general.config.js";
const { jwtSecret } = configObject;
const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);
const generateToken = (userId) => {
  return jwt.sign( { userId } , jwtSecret, { expiresIn: '1h' });
}
const assignCartToUser = async (user) => {
  if (!user.cart) {
    const newCart = await manager.addCart();
    user.cart = newCart._id;
    await user.save();
  }
  return user;
}
const verifyToken = (token) => {
  if (token) {
    try {
      jwt.verify(token, jwtSecret);
      return true;
    } catch {
      return false;
    }
  }
}
export {createHash, isValidPassword, generateToken, assignCartToUser, verifyToken};
