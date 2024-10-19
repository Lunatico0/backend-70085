import CartManager from "../DAO/db/cartManagerDb.js";

const manager = new CartManager();

class cartController {
  async getAllCarts(req, res) {
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
  };

  async getCartById(req, res) {
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
  };

  async addCart(req, res) {
    try {
      const newCart = await manager.addCart();
      res.status(201).json({ message: "Carrito creado exitosamente", newCart });
    } catch (error) {
      res.status(500).json({ status: "error", error: error.message });
    };
  };

  async updateProductsInCart(req, res) {
    if (!req.user) {
      return res.status(401).redirect('/login');
    };

    const { pid } = req.params;
    const quantity = req.body.quantity || 1;
    let cartId = req.user.cart;

    try {
      if (!cartId) {
        const newCart = await manager.addCart();
        req.user.cart = newCart._id;
        await req.user.save();
        cartId = newCart._id;
      };

      const result = await manager.addProductToCart(cartId, pid, quantity);
      res.status(200).json({ message: "Producto agregado al carrito exitosamente", result });
    } catch (error) {
      res.status(500).json({ status: "error", error: error.message });
    };
  };

  async updateProductsInCartById(req, res) {
    try {
      const cid = req.params.cid || req.user.cart;
      const { pid } = req.params;
      const quantity = req.body.quantity || 1;

      if (!cid) {
        return res.status(400).json({ message: 'No se pudo encontrar el carrito' });
      };

      const result = await manager.addProductToCart(cid, pid, quantity);

      if (result) {
        res.status(200).json({ message: "Producto agregado al carrito exitosamente", result });
      } else {
        res.status(400).json({ message: "Error al agregar producto al carrito" });
      }
    } catch (error) {
      res.status(500).json({ status: "error", error: error.message });
    };
  };

  async updateCartById(req, res) {
    const { cid } = req.params;
    const { products } = req.body;

    if (!Array.isArray(products)) {
      return res.status(400).json({ message: "El formato de productos es inválido, debe ser un array" });
    };

    try {
      const cart = await manager.getCartById(cid);
      if (!cart) {
        return res.status(404).json({ message: "Carrito no encontrado" });
      };

      const productMap = new Map(products.map(product => [product.productId, product.quantity || 1]));

      cart.products.forEach(cartProduct => {
        if (productMap.has(cartProduct.product.toString())) {
          cartProduct.quantity = productMap.get(cartProduct.product.toString());
          productMap.delete(cartProduct.product.toString());
        };
      });

      productMap.forEach((quantity, productId) => {
        cart.products.push({ product: productId, quantity });
      });

      await cart.save();

      res.status(200).json({ message: "Carrito actualizado exitosamente", cart });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    };
  };

  async emptyCart(req, res) {
    const { cid } = req.params;

    try {
      const cart = await manager.getCartById(cid);
      if (!cart) {
        return res.status(404).json({ message: "Carrito no encontrado" });
      }

      cart.products = [];

      await cart.save();

      res.status(200).json({ message: "Carrito vaciado exitosamente" });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  async deleteCartById(req, res) {
    const { cid } = req.params;
    try {
      const result = await manager.deleteCart(cid);
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Carrito eliminado exitosamente", result });
      } else {
        res.status(404).json({ message: "No se pudo encontrar el carrito" });
      };
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    };
  };

  async deleteProductFromCart(req, res) {
    const { cid, pid } = req.params;
    try {
      const result = await manager.deleteProductFromCart(cid, pid);
      if (result) {
        res.status(200).json({ message: "Producto eliminado exitosamente", result });
      } else {
        res.status(404).json({ message: "No se pudo encontrar el producto en el carrito" });
      };
    } catch (error) {
      res.status(500).json({ status: "error", error: error.message });
    };
  };
};

export default cartController;
