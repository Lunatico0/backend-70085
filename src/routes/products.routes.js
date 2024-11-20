import { Router } from "express";
import ProductController from '../controllers/productController.js'
const productController = new ProductController();
const router = Router();

router.get('/', productController.getAllProducts);

router.get('/categories', productController.getCategories);

router.get("/:pid", productController.getProductById);

router.post("/", productController.addProduct);

router.put("/:pid", productController.updateProduct);

router.delete("/:pid", productController.deleteProduct);

router.get('/ping', (req, res) => res.status(200).send('pong'));

export default router;
