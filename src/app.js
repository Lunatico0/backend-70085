import express from "express";
import passport from "passport";
import cors from 'cors';
import cookieParser from "cookie-parser";
import initializePassport from "./config/passport.config.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { config } from 'dotenv';
import productsRouter from "./routes/products.routes.js";
import cartRouter from "./routes/cart.routes.js";
import viewsRouter from "./routes/views.routes.js";
import sessionRouter from "./routes/session.routes.js";
import ProductManager from './dao/db/productManagerDb.js';
import "./db.js"
config();

const productManager = new ProductManager();

const app = express();
const PORT = process.env.PORT || 8080;

// app.use(cors({
//   origin: '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
// app.options('*', cors()); pruevas para usar la api para alimentar un front

app.use(express.json());
app.use(express.urlencoded({extended: true }));
app.use(cookieParser());
app.use(express.static("./src/public"));
initializePassport();
app.use(passport.initialize());

app.engine('handlebars', engine({
  runtimeOptions: {                       //
    allowProtoPropertiesByDefault: true,  // Por si ".lean()" no funciona en productManagerDb.js
    allowProtoMethodsByDefault: true,     // Cumple la misma funcion
  },                                      //
  helpers: {
    formatNumber: (number, decimals = 2) => {
      if (number === null || number === undefined || isNaN(number)) {
        return 'N/A';
      }
      return Number(number).toFixed(decimals);
    },
    add: function (a, b) {
      return a + b;
    },
    and: function (a, b) {
      return a == b;
    },
    eq: function (a, b) {
      return a == b;
    },
    subtract: function (a, b) {
      return (a - b)
    },
    modifyImageUrl: (url, width, height) => {
      if (typeof url === 'string') {
        return url.replace(/width=\d+/, `width=${width}`)
          .replace(/height=\d+/, `height=${height}`);
      }
      return url;
    },
    ifCond: function (v1, operator, v2, options) {
      switch (operator) {
        case '==':
          return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
          return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
          return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
          return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
          return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
          return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
          return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
          return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        default:
          return options.inverse(this);
      }
    },
    or: function (a, b) {
      return a || b;
    },
    gt: function (a, b) {
      return a > b;
    },
    lt: function (a, b) {
      return a < b;
    },
    gte: (a, b) => {
      return a >= b;
    },
    lte: (a, b) => {
      return a <= b;
    },
    multiply: (a, b) => {
      return a * b;
    }
  }
}));
app.set('view engine', 'handlebars');
app.set('views', 'src/views');

app.use("/api/carts", cartRouter);
app.use("/api/products", productsRouter);
app.use('/api/sessions', sessionRouter);
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
