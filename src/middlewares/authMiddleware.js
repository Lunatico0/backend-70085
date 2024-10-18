import jwt from "jsonwebtoken";
import configObject from "../config/general.config.js";
import UserModel from "../DAO/models/user.model.js";

const { jwtSecret } = configObject;

// Middleware para validar si el usuario es admin
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

    if (req.path === '/login') {
      return res.redirect('/');
    }

    req.user = decoded;
    return next();
  });
};

// Middleware para validar la autenticidad del token y proteger rutas
export const validateToken = (req, res, next) => {
  const token = req.cookies['token'];

  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      res.clearCookie('token');
      return res.status(401).send("Invalid or expired token.");
    }

    req.user = decoded;
    next();
  });
};

// Middleware para verificar si el usuario tiene sesión activa
export const validateUserSession = async (req, res, next) => {
  const token = req.cookies['token'];

  if (!token) {
    return res.status(401).send("Usuario no autenticado. Inicia sesión.");
  }

  jwt.verify(token, jwtSecret, async (err, decoded) => {
    if (err) {
      res.clearCookie('token');
      return res.status(401).send("Token inválido o expirado. Inicia sesión nuevamente.");
    }

    try {
      const user = await UserModel.findById(decoded.userId)

      if (!user) {
        return res.status(404).send("Usuario no encontrado.");
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(`Error al buscar usuario: ${error}`);
      res.status(500).send("Error interno al buscar el usuario.");
    }
  });
};
