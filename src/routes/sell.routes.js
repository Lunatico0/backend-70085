import { Router } from 'express';
import validarVenta from '../utils/sellMiddleware.js';
import sellController from '../controllers/sellController.js';

const router = Router();

router.post('/', validarVenta, sellController.crearVenta);

export default router;
