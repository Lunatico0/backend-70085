import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import express from "express";
import passport from "passport";
import cartRouter from "./routes/cart.routes.js";
import sellRouter from "./routes/sell.routes.js";
import viewsRouter from "./routes/views.routes.js";
import cookieParser from "cookie-parser";
import configObject from "./config/general.config.js";
import sessionRouter from "./routes/session.routes.js";
import ProductManager from './dao/db/productManagerDb.js';
import productsRouter from "./routes/products.routes.js";
import clientsRouter from "./routes/client.routes.js";
import contactRouter from "./routes/contact.routes.js";
import initializePassport from "./config/passport.config.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { handlebarsHelpers, calculateSubtotal, calculateTotal } from "./utils/handlebars.helpers.js"
import "./db.js";
import Handlebars from 'handlebars';
import { callbackPromise } from 'nodemailer/lib/shared/index.js';

// Registrar los helpers de Handlebars
Object.keys(handlebarsHelpers).forEach((helper) => {
  Handlebars.registerHelper(helper, handlebarsHelpers[helper]);
});

// Registrar los helpers de cálculo
Handlebars.registerHelper('calculateSubtotal', calculateSubtotal);
Handlebars.registerHelper('calculateTotal', calculateTotal);

const app = express();
const productManager = new ProductManager();
const { PORT } = configObject;
const { sessionSecret } = configObject;
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:8080',
      'http://localhost:5173',
      'https://2rrp47lk-5173.brs.devtunnels.ms/',
      'https://artemisa-presupuesto.vercel.app',
      'https://artemisanogoya.vercel.app',
      'https://backend-70085.vercel.app',
      'https://backend-70085.onrender.com',
      'https://artemisa-db.vercel.app',
    ];

    // Permitir todos los subdominios de artemisa-pvc.com
    const artemisaRegex = /^https?:\/\/([a-z0-9-]+\.)?artemisa-pvc\.com$/;

    if (!origin || allowedOrigins.includes(origin) || artemisaRegex.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

initializePassport();

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://vercel.live", "https://cdn.tailwindcss.com", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https://vigorita.com.ar"],
    },
  })
);
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
    secure: false
  }
}));
app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', engine({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  helpers: handlebarsHelpers, calculateSubtotal, calculateTotal
}));
app.set('view engine', 'handlebars');
app.set('views', 'src/views');

app.use("/api/carts", cartRouter);
app.use("/api/products", productsRouter);
app.use('/api/sessions', sessionRouter);
app.use('/api/clients', clientsRouter);
app.use('/contact', contactRouter);
app.use('/api/sells', sellRouter);
app.use('/', viewsRouter);
app.use('/status', (req, res) => res.status(200).send('OK'));

const httpServer = app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

const io = new Server(httpServer);

io.on("connection", async (socket) => {
  const initialProducts = await productManager.getProducts(1, 15);

  socket.emit('products', initialProducts);

  socket.on('requestPage', async ({ page, limit, sort }) => {
    const products = await productManager.getProducts(page, limit, sort);
    socket.emit('products', products);
  });
});
