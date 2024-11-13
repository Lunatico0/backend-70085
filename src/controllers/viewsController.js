import jwt from "jsonwebtoken";
import juice from 'juice';
import nodemailer from 'nodemailer';
import configObject from '../config/general.config.js';
import ProductManager from '../dao/db/productManagerDb.js';
import CartManager from '../dao/db/cartManagerDb.js';
import CategoryModel from '../dao/models/categories.model.js'
import UserModel from "../dao/models/user.model.js";
import userServices from "../services/userServices.js";
import ticketServices from "../services/ticketServices.js";
import productsServices from "../services/productsServices.js";

const productManager = new ProductManager();
const cartManager = new CartManager();
const { jwtSecret, mailerPassword } = configObject;

class viewsController {
  async home(req, res) {
    try {
      let user = req.session.user;
      let cart = user ? await cartManager.getCartById(user.cart) : null;
      const token = req.cookies['token'];

      if (token) {
        try {
          const decodedUser = jwt.verify(token, jwtSecret);
          let res;
          if (decodedUser) {
            res = await fetch('http://localhost:8080/api/sessions/current', {
              method: 'GET',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            const responseData = await res.json();
            user = responseData;
          }
        } catch (error) {
          console.log("Token no válido o expirado:", error.message);
        }
      }

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
        user: user || null,
        cart: cart,
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
  }

  async cartById(req, res) {
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
  }

  async realTimeProducts(req, res) {
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
      sort: querySort,
      user: req.user
    });
  }

  login(req, res) {
    const { email } = req.query;
    res.render("login", { email: email || '' });
  }

  register(req, res) {
    res.render("register");
  }

  async userCart(req, res) {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "User not found" })
    const userData = await UserModel.findById(user._id);
    const cart = await cartManager.getCartById(userData.cart);
    res.render('cart', { userData: userData, products: cart.products });
  }

  async userProfile(req, res) {
    try {
      const { user, cart } = await userServices.getUserProfile(req.session);
      res.render('profile', { user, cart });
    } catch (error) {
      if (error.message === 'User not authenticated') {
        return res.redirect('/login');
      }
      res.status(500).send('Error al cargar el perfil');
    }
  }

  async contact(req, res) {
    res.render('contact');
  }

  async purchase(req, res) {
    const { purchaseId } = req.params;
    try {
      if (!purchaseId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).render('error', {
          title: 'ID inválido',
          message: 'El número de ticket proporcionado no es válido.',
          buttons: [{ text: 'Volver a las compras', href: '/' }]
        });
      };

      const purchaseDetails = await ticketServices.getTicketById(purchaseId);

      if (!purchaseDetails) {
        return res.status(404).render('error', {
          title: 'Compra no encontrada',
          message: 'No se ha encontrado una compra con ese número de ticket.',
          buttons: [{ text: 'Volver a las compras', href: '/' }]
        });
      };

      const user = await userServices.findByEmail(purchaseDetails.purchaser);
      const products = await Promise.all(
        purchaseDetails.products.map(async (product) => {
          const productData = await productsServices.getProductById(product.productId);
          return {
            ...productData,
            quantity: product.quantity,
          };
        })
      );

      const htmlTicket = await new Promise((resolve, reject) => {
        res.render('purchase', { purchase: purchaseDetails, user, products }, (err, html) => {
          if (err) {
            return reject(err);
          }
          resolve(html);
        });
      });

      const htmlWithoutHeader = htmlTicket.replace(/<header.*?<\/header>/s, '');
      const htmlWithFooter = htmlWithoutHeader.replace(/<footer.*?<\/footer>/s, `<footer>Muchas gracias por tu compra. ARTEMISA</footer>`);
      const htmlWithInlineStyles = juice(htmlWithFooter);

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        auth: {
          user: 'pittanapatricio@gmail.com',
          pass: mailerPassword
        }
      });

      await transporter.sendMail({
        from: "Artemisa <info@artemisa.com>",
        to: user.email,
        subject: `Tu compra en Artemisa - Ticket #${purchaseId}`,
        html: htmlWithInlineStyles
      });

      return res.render('purchase', { purchase: purchaseDetails, user, products });

    } catch (error) {
      console.error('Error al procesar la compra:', error);

      return res.status(500).render('error', {
        title: 'Error del servidor',
        message: 'Ocurrió un error al procesar la compra. Por favor, inténtelo más tarde.',
        buttons: [{ text: 'Volver al inicio', href: '/' }]
      });
    };
  };
}

export default viewsController;
