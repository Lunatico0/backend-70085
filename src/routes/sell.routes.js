import { Router } from 'express';
import validarVenta from '../utils/sellMiddleware.js';
import sellController from '../controllers/sellController.js';

const router = Router();

router.get('/', sellController.getSells)

router.post('/', validarVenta, sellController.newSell);

export default router;
