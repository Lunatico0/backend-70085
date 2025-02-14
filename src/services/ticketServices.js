import TicketRepository from '../repository/ticketRepository.js';
import CartRepository from '../repository/cartRepository.js'
import { v4 as uuidv4 } from 'uuid';

class TicketService {
  async processPurchase(cartId, userData) {
    const cart = await CartRepository.getCartById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');

    let totalAmount = 0;
    const purchasedProducts = [];

    for (const item of cart.products) {
      const product = item.product;
      if (!product || product.stock < item.quantity) continue;

      product.stock -= item.quantity;
      totalAmount += product.price * item.quantity;
      purchasedProducts.push({ productId: product._id, quantity: item.quantity });
      await product.save();
    }

    if (purchasedProducts.length === 0) throw new Error('No hay productos disponibles para la compra');

    // 🔥 Verifica que userData tenga los datos necesarios
    if (!userData.email || !userData.nombre) {
      throw new Error('Faltan datos del comprador');
    }

    const ticketData = {
      code: uuidv4(),
      purchaser: {
        email: userData.email,
        nombre: userData.nombre,
        apellido: userData.apellido,
        telefono: userData.telefono || "",
        direccion: userData.direccion || "",
        localidad: userData.localidad || "",
        comentarios: userData.comentarios || ""
      },
      products: purchasedProducts,
      amount: totalAmount,
      status: 'completed'
    };


    const res = await TicketRepository.create(ticketData);
    return res
  }

  async getTicketById(ticketId) {
    const ticket = await TicketRepository.findById(ticketId);

    if (!ticket) {
      throw new Error("No se encontró el ticket.");
    }

    return ticket;
  }
}

export default new TicketService();
