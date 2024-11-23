import TicketRepository from '../repository/ticketRepository.js';
import CartRepository from '../repository/cartRepository.js'
import { v4 as uuidv4 } from 'uuid';

class TicketService {
  async processPurchase(cartId, userEmail) {
    const cart = await CartRepository.getCartById(cartId);
    if (!cart) {
      throw new Error('Cart not found');
    }

    let totalAmount = 0;
    const unavailableProducts = [];
    const purchasedProducts = [];

    for (const item of cart.products) {
      const product = item.product;

      if (!product) {
        unavailableProducts.push({ productId: item.product, message: 'Product not found' });
        continue;
      }

      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        totalAmount += product.price * item.quantity;
        purchasedProducts.push({ productId: product._id, quantity: item.quantity });
        await product.save();
      } else {
        unavailableProducts.push({
          productId: product._id,
          title: product.title,
          availableQuantity: product.stock,
          requestedQuantity: item.quantity
        });
      }
    }

    if (purchasedProducts.length > 0) {
      const ticketData = {
        code: uuidv4(),
        purchaser: userEmail,
        products: purchasedProducts,
        amount: totalAmount,
        status: 'completed'
      };
      const ticket = await TicketRepository.create(ticketData);

      return { ticket, unavailableProducts };
    } else {
      throw new Error('No products available for purchase');
    };
  };

  async getTicketById(ticketId) {
    return await TicketRepository.findById(ticketId);
  }
}

export default new TicketService();
