import { Router } from "express";
import userController from '../controllers/userController.js';

const router = Router();

router.get('/', userController.getClients);

router.get('/:id', userController.getClientById);

router.post('/newClients', userController.newClient);

export default router;
