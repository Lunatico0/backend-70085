import { Router } from "express";
import CartManager from "../dao/db/cartManagerDb.js";

const router = Router();
const manager = new CartManager();

router.get("/", async (req, res) => {
  try {
    const carts = await manager.getCarts();
    if (carts && carts.length > 0) {
      res.status(200).json({ message: "Todos los carritos", carts });
    } else {
      res.status(404).json({ message: "No se encontraron carritos" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await manager.getCartById(cid);
    if (cart) {
      res.status(200).json({ message: "Carrito encontrado", cart });
    } else {
      res.status(404).json({ message: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al buscar el carrito", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newCart = await manager.addCart();
    res.status(201).json({ message: "Carrito creado exitosamente", newCart });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const quantity = req.body.quantity || 1;
  try {
    const result = await manager.addProductToCart(cid, pid, quantity);
    if (result) {
      res.status(200).json({ message: "Producto agregado al carrito exitosamente", result });
    } else {
      res.status(400).json({ message: "Error al agregar producto al carrito" });
    }
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const quantity = req.body.quantity || 1;
  try {
    const result = await manager.addProductToCart(cid, pid, quantity);
    if (result) {
      res.status(200).json({ message: "Producto agregado al carrito exitosamente", result });
    } else {
      res.status(400).json({ message: "Error al agregar producto al carrito" });
    }
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

router.put("/:cid", async (req, res) => { //Actualizar y mantener los productos existentes
  const { cid } = req.params;             //Al final de este archivo hay un comentario sobre este metodo
  const { products } = req.body;

  if (!Array.isArray(products)) {
    return res.status(400).json({ message: "El formato de productos es inválido, debe ser un array" });
  }

  try {
    const cart = await manager.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    // Crear un mapa de los productos entrantes
    const productMap = new Map(products.map(product => [product.productId, product.quantity || 1]));

    // Actualizar las cantidades de los productos existentes en el carrito
    cart.products.forEach(cartProduct => {
      if (productMap.has(cartProduct.product.toString())) {
        cartProduct.quantity = productMap.get(cartProduct.product.toString());
        productMap.delete(cartProduct.product.toString());
      }
    });

    // Añadir nuevos productos que no estaban en el carrito
    productMap.forEach((quantity, productId) => {
      cart.products.push({ product: productId, quantity });
    });

    await cart.save();

    res.status(200).json({ message: "Carrito actualizado exitosamente", cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const result = await manager.deleteCart(cid);
    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Carrito eliminado exitosamente", result });
    } else {
      res.status(404).json({ message: "No se pudo encontrar el carrito" });
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const result = await manager.deleteProductFromCart(cid, pid);
    if (result) {
      res.status(200).json({ message: "Producto eliminado exitosamente", result });
    } else {
      res.status(404).json({ message: "No se pudo encontrar el producto en el carrito" });
    }
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

export default router;

/**     
 * Este metodo reemplaza completamente los productos de dichoo carrito con los nuevos
 * 
 * router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;

  if (!Array.isArray(products)) {
    return res.status(400).json({ message: "El formato de productos es inválido, debe ser un array" });
  }

  try {
    const cart = await manager.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    // Reemplaza todos los productos existentes con el nuevo arreglo
    cart.products = products.map(product => ({
      product: product.productId,
      quantity: product.quantity || 1,
    }));

    await cart.save();

    res.status(200).json({ message: "Carrito actualizado exitosamente", cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});
 */