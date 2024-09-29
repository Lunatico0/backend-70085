import { Router } from 'express';
import { config } from "dotenv";
import ProductManager from '../dao/db/productManagerDb.js';
import CartManager from '../dao/db/cartManagerDb.js';
import CategoryModel from '../dao/models/categories.model.js';
import jwt from "jsonwebtoken";

config();

const productManager = new ProductManager();
const cartManager = new CartManager();
const router = Router();
const jwtSecret = process.env.JWT_SECRET;

router.get(['/products', '/'], async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 15;
    const catQuery = req.query.category;
    const subCatQuery = req.query.subcategory;
    const querySort = req.query.sort || "defa";
    let sort = {};

    switch (querySort) {
      case "price_asc":
        sort = { price: 1 };
        break;
      case "price_desc":
        sort = { price: -1 };
        break;
      case "alpha_asc":
        sort = { title: 1 };
        break;
      case "alpha_desc":
        sort = { title: -1 };
        break;
      case "defa":
        sort = { createdAt: 1 };
        break;
      default:
        break;
    }

    const categories = await CategoryModel.find().lean();

    const { prodRender, productsList } = await productManager.getProducts(page, limit, sort, catQuery, subCatQuery);

    const maxPagesToShow = 5;
    let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(startPage + maxPagesToShow - 1, productsList.totalPages);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    res.render('home', {
      payload: prodRender,
      hasPrevPage: productsList.hasPrevPage,
      hasNextPage: productsList.hasNextPage,
      prevPage: productsList.prevPage,
      nextPage: productsList.nextPage,
      page: productsList.page,
      totalPages: pages,
      lastPage: productsList.totalPages,
      limit: limit,
      sort: querySort,
      categories: categories,
      currentPath: req.path,
      currentCategory: catQuery,
      currentSubCategory: subCatQuery
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

router.get('/carts/:cid', async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await cartManager.getCartById(cid);

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado"
      });
    }

    const cartProducts = cart.products.map(item => {
      let thumbnailArray = [];
      item.product.thumbnails.forEach(img => {
        thumbnailArray.push(img);
      });

      return {
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        thumbnail: thumbnailArray
      };
    });

    res.render('cart', {
      cartId: cid,
      products: cartProducts,
      totalItems: cart.products.length,
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

router.get("/realTimeProducts", async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 15;
  const querySort = req.query.sort;
  let sort = {};

  switch (querySort) {
    case "asc":
      sort = { price: 1 };
      break;

    case "desc":
      sort = { price: -1 };
      break;

    default:
      break;
  }

  const { prodRender, productsList } = await productManager.getProducts(page, limit, sort);

  res.render("realTimeProducts", {
    products: {
      prodRender,
      productsList
    },
    hasPrevPage: productsList.hasPrevPage,
    hasNextPage: productsList.hasNextPage,
    prevPage: productsList.prevPage,
    nextPage: productsList.nextPage,
    currentPage: productsList.page,
    totalPages: productsList.totalPages,
    limit: limit,
    sort: querySort
  });
});

const checkUserSession = (req, res, next) => {
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

router.get("/login", checkUserSession, (req, res) => {
  res.render("login");
});

router.get("/register", checkUserSession, (req, res) => {
  res.render("register");
});

export default router;
