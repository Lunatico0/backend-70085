import TicketService from '../services/ticketServices.js';
import cartRepository from '../repository/cartRepository.js';

class TicketController {
  async purchaseCart(req, res) {
    try {
      const cartId = req.params.cid;
      const userData = req.body.cliente;

      const ticket = await TicketService.processPurchase(cartId, userData);

      // Actualizar el carrito eliminando productos comprados
      const cart = await cartRepository.getCartById(cartId);

      cart.products = cart.products.filter((cartItem) =>
        !ticket.products.some((ticketItem) => ticketItem.productId.equals(cartItem.product._id))
      );

      await cartRepository.updateCart(cart._id, cart.products);

      return res.status(200).json({
        success: true,
        message: 'Compra realizada con éxito',
        ticket,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error en la compra',
        error: error.message,
      });
    }
  };

  async confirmPurchase(req, res) {
    try {
      const { ticketId } = req.params;
      const ticket = await TicketService.getTicketById(ticketId);
      const cart = await cartRepository.getCartById(req.user.cart);

      if (!ticket || !ticket.products) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo encontrar el ticket de compra o no tiene productos',
        });
      }

      if (!cart) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo encontrar el carrito del usuario',
        });
      }

      // Eliminar del carrito los productos que se compraron
      cart.products = cart.products.filter(cartItem =>
        !ticket.products.some(ticketItem => ticketItem.productId.equals(cartItem.product._id))
      );
      await cartRepository.updateCart(cart._id, cart);

      return res.status(200).json({
        success: true,
        message: 'Compra confirmada con éxito',
        ticket,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Hubo un problema al confirmar la compra',
        error: error.message,
      });
    }
  };

  async getPurcaseDetails(req, res) {
    try {
      const purchaseId = req.params.purchaseId;
      if (!purchaseId) {
        return res.status(400).json({ success: false, message: "El ID de la compra es requerido" });
      }

      const ticket = await TicketService.getTicketById(purchaseId);
      if (!ticket) {
        return res.status(404).json({ success: false, message: "Ticket no encontrado" });
      }

      return res.status(200).json({ success: true, ticket });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error al obtener los detalles de la compra", error: error.message });
    }
  }

}

export default new TicketController();
