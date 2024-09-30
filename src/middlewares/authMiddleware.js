import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const jwtSecret = process.env.JWT_SECRET;

export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send('Usuario no autenticado. Inicia sesión.');
  }

  if (req.user.role !== 'admin') {
    return res.status(403).send('No tienes permisos para acceder a esta página.');
  }

  next();
};

export const checkUserSession = (req, res, next) => {
  const token = req.cookies['token'];

  if (!token) {
    return next();
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return next();
    }

    return res.redirect('/api/sessions/current');
  });
};
