import { Router } from "express";
import ProductManager from '../dao/db/productManagerDb.js';
const manager = new ProductManager();
const router = Router();

router.get('/', async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 15;
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

  const { prodRender, productsList } = await manager.getProducts(page, limit, sort);

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

  const prevLink = productsList.hasPrevPage ? `/api/products?page=${productsList.prevPage}&limit=${limit}&sort=${querySort}` : null;
  const nextLink = productsList.hasNextPage ? `/api/products?page=${productsList.nextPage}&limit=${limit}&sort=${querySort}` : null;

  res.json({
    status: "success",
    payload: prodRender,
    totalPages: productsList.totalPages,
    prevPage: productsList.prevPage,
    nextPage: productsList.nextPage,
    page: productsList.page,
    hasPrevPage: productsList.hasPrevPage,
    hasNextPage: productsList.hasNextPage,
    prevLink: prevLink,
    nextLink: nextLink
  });
});

router.get("/:pid", async (req, res) => {
  let id = req.params.pid;
  try {
    const product = await manager.getProductsById(id);
    !product ? res.send("No se encuentra el producto deseado") : res.send({ product });
  } catch (error) {
    console.log(error)
  }
});

router.post("/", async (req, res) => {
  const newProduct = req.body;
  try {
    await manager.addProduct(newProduct);
    res.status(201).send({ message: "Producto agregado exitosamente", newProduct });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  const id = req.params.pid;
  const newData = req.body;
  try {
    const updatedProduct = await manager.updateProduct(id, newData);
    !updatedProduct ? res.status(404).send({ message: "Error al actualizar el producto" }) : res.status(200).send(`Se ha actualizado el producto ${newData.title} correctamente`);
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  const id = req.params.pid;
  try {
    const deletedProd = await manager.deleteProduct(id);
    !deletedProd ? res.status(404).send({ message: "Error al eliminar el producto", error: "Producto no encontrado" }) : res.status(200).send(`Se ha eliminado ${deletedProd.title} correctamente`);
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

export default router;