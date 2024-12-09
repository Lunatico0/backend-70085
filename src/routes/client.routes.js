import { Router } from "express";
import userController from '../controllers/userController.js';

const router = Router();

router.get('/clients', userController.getClients);

router.post('/clients', userController.newClient);

export default router;
