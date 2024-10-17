import { Router } from "express";
import passport from "passport";
import CartController from "../controllers/cartController.js";
import ticketController from "../controllers/ticketController.js";
import { validateUserSession } from "../middlewares/authMiddleware.js";

const cartController = new CartController()
const router = Router();

router.get("/", cartController.getAllCarts);

router.get("/:cid", cartController.getCartById);

router.post('/:cid/purchase', validateUserSession, ticketController.purchaseCart);

router.post('/:ticketId/confirm-purchase', validateUserSession, ticketController.confirmPurchase);

router.post("/", cartController.addCart);

router.post("/:pid", (req, res, next) => {
  passport.authenticate('current', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.redirect('/login');
    }

    req.user = user;
    next();
  })(req, res, next);
}, cartController.updateProductsInCart);

router.post('/:cid/products/:pid', passport.authenticate('current', { session: false }), cartController.updateProductsInCartById);

router.put("/:cid", cartController.updateCartById);

router.delete('/:cid/empty', cartController.emptyCart);

router.delete("/:cid", cartController.deleteCartById);

router.delete("/:cid/products/:pid", cartController.deleteProductFromCart);

export default router;
