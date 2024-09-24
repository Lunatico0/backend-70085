import CartModel from '../models/cart.model.js'
import mongoose from 'mongoose';

class CartManager {

  async addCart() {
    const newCart = new CartModel({ products: [] });
    try {
      await newCart.save();
      return newCart;
    } catch (error) {
      console.error('Error adding new cart:', error);
      throw new Error('Error adding new cart');
    }
  };

  async getCarts() {
    try {
      const allCarts = await CartModel.find();
      if (allCarts.length === 0) throw new Error('No carts found');
      return allCarts;
    } catch (error) {
      console.error('Error getting all carts:', error);
      throw new Error('Error getting all carts');
    }
  };

  async getCartById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid cart ID');
    }

    try {
      const foundCart = await CartModel.findById(id).populate('products.product');
      if (!foundCart) throw new Error('Cart not found');
      return foundCart;
    } catch (error) {
      console.error('Error getting cart by ID:', error);
      throw new Error('Error getting cart by ID');
    }
  };

  async addProductToCart(idCart, idProduct, quantity = 1) {
    if (!mongoose.Types.ObjectId.isValid(idCart) || !mongoose.Types.ObjectId.isValid(idProduct)) {
      throw new Error('Invalid cart or product ID');
    }

    try {
      const cart = await this.getCartById(idCart);
      const productFound = cart.products.find(p => p.product.equals(idProduct));

      if (productFound) {
        productFound.quantity += quantity;
      } else {
        cart.products.push({ product: idProduct, quantity });
      }

      await cart.save();
      return cart;
    } catch (error) {
      console.error('Error adding product to cart:', error);
      throw new Error('Error adding product to cart');
    }
  };

  async deleteProductFromCart(idCart, idProduct) {
    if (!mongoose.Types.ObjectId.isValid(idCart) || !mongoose.Types.ObjectId.isValid(idProduct)) {
      throw new Error('Invalid cart or product ID');
    }

    try {
      const cart = await this.getCartById(idCart);
      const productIndex = cart.products.findIndex(p => p.product.equals(idProduct));

      if (productIndex !== -1) {
        cart.products.splice(productIndex, 1);
        await cart.save();
        return cart;
      } else {
        throw new Error('Product not found in cart');
      }
    } catch (error) {
      console.error('Error deleting product from cart:', error);
      throw new Error('Error deleting product from cart');
    }
  };

  async deleteCart(idCart) {
    if (!mongoose.Types.ObjectId.isValid(idCart)) {
      throw new Error('Invalid cart ID');
    }

    try {
      const result = await CartModel.deleteOne({ _id: idCart });
      if (result.deletedCount === 0) throw new Error('Cart not found');
      return result;
    } catch (error) {
      console.error('Error deleting cart:', error);
      throw new Error('Error deleting cart');
    }
  };
};

export default CartManager;