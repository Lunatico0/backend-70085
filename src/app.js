import cors from 'cors';
import session from 'express-session';
import express from "express";
import passport from "passport";
import cartRouter from "./routes/cart.routes.js";
import viewsRouter from "./routes/views.routes.js";
import cookieParser from "cookie-parser";
import configObject from "./config/general.config.js";
import sessionRouter from "./routes/session.routes.js";
import ProductManager from './DAO/db/productManagerDb.js';
import productsRouter from "./routes/products.routes.js";
import contactRouter from "./routes/contact.routes.js";
import initializePassport from "./config/passport.config.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { handlebarsHelpers, calculateSubtotal, calculateTotal } from "./utils/handlebars.helpers.js"
import "./db.js";
import Handlebars from 'handlebars';

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
  origin: /https?:\/\/((.*\.)?mi-app\.com|(.*\.)?brs\.devtunnels\.ms)/,
  credentials: true
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({extended: true }));
app.use(express.static("./src/public"));

initializePassport();
app.use(passport.initialize());

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
app.use('/contact', contactRouter);
app.use('/', viewsRouter);

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
