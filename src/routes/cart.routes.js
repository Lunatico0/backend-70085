import { Router } from "express";
import CartController from "../controllers/cartController.js";
import ticketController from "../controllers/ticketController.js";

const cartController = new CartController()
const router = Router();

router.get("/", cartController.getAllCarts);

router.get("/:cid", cartController.getCartById);

router.post('/:cid/purchase', ticketController.purchaseCart);

router.post('/:ticketId/confirm-purchase', ticketController.confirmPurchase);

router.post("/", cartController.addCart);

router.post("/:pid", cartController.updateProductsInCart);

router.post('/:cid/products/:pid', cartController.updateProductsInCartById);

router.put("/:cid", cartController.updateCartById);

router.delete('/:cid/empty', cartController.emptyCart);

router.delete("/:cid", cartController.deleteCartById);

router.delete("/:cid/products/:pid", cartController.deleteProductFromCart);

export default router;
