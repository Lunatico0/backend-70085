import { Router } from 'express';
import passport from "passport";
import { checkUserSession, isAdmin } from '../middlewares/authMiddleware.js';
import ViewsController from '../controllers/viewsController.js';

const router = Router();
const viewsController = new ViewsController();

router.get(['/products', '/'], viewsController.home);

router.get('/carts/:cid', viewsController.cartById);

router.get("/realTimeProducts", passport.authenticate('current', { session: false }), isAdmin, viewsController.realTimeProducts);

router.get("/login", checkUserSession, viewsController.login);

router.get("/register", checkUserSession, viewsController.register);

router.get('/cart', passport.authenticate('current', { session: false }), viewsController.userCart);

router.get('/profile', checkUserSession, viewsController.userProfile);

router.get('/contact', viewsController.contact);

router.get('/purchase/:purchaseId', viewsController.purchase);

export default router;
