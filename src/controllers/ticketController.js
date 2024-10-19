import TicketService from '../services/ticketServices.js';
import cartRepository from '../repository/cartRepository.js';

class TicketController {
  async purchaseCart(req, res) {
    try {
      const cartId = req.params.cid;
      const userEmail = req.user.email;

      const { ticket, unavailableProducts } = await TicketService.processPurchase(cartId, userEmail);

      if (unavailableProducts.length > 0) {
        return res.status(400).render('error', {
          title: 'Stock insuficiente',
          message: 'Algunos productos no están disponibles en la cantidad solicitada',
          description: 'Puedes volver al carrito para ajustar las cantidades o proceder con los disponibles.',
          buttons: [
            { text: 'Volver al carrito', href: '/cart', method: 'GET' },
            { text: 'Comprar disponibles', href: `/api/carts/${ticket._id}/confirm-purchase`, method: 'POST' }
          ]
        });
      };

      const cart = await cartRepository.getCartById(cartId);

      cart.products = cart.products.filter(cartItem =>
        !ticket.products.some(ticketItem => ticketItem.productId.equals(cartItem.product._id))
      );

      await cartRepository.updateCart(cart._id, cart);

      if (req.headers['accept'].includes('application/json')) {
        return res.status(200).json({
          message: 'Purchase completed',
          ticket,
          unavailableProducts
        });
      } else {
        return res.redirect(`/purchase/${ticket._id}`);
      };
    } catch (error) {
      if (req.headers['accept'].includes('application/json')) {
        return res.status(500).json({
          message: 'Error en la compra',
          error: error.message
        });
      } else {
        return res.status(500).render('error', {
          title: 'Compra fallida',
          message: 'Hubo un error al procesar la compra',
          description: error.message,
          buttons: [
            { text: 'Volver al carrito', href: `/cart` },
            { text: 'Ir a inicio', href: '/' }
          ]
        });
      };
    };
  };

  async confirmPurchase(req, res) {
    try {
      const { ticketId } = req.params;
      const ticket = await TicketService.getTicketById(ticketId);
      const cart = await cartRepository.getCartById(req.user.cart);

      if (!ticket.products) {
        throw new Error('El ticket no contiene productos');
      }

      if (!ticket) {
        return res.status(404).render('error', {
          title: 'Error de compra',
          message: 'No se pudo encontrar el ticket de compra.',
          buttons: [{ text: 'Volver al carrito', href: '/cart' }]
        });
      }

      if (!cart) {
        return res.status(404).render('error', {
          title: 'Error de carrito',
          message: 'No se pudo encontrar el carrito del usuario.',
          buttons: [{ text: 'Volver a la tienda', href: '/' }]
        });
      }

      // Eliminar del carrito los productos que se compraron (que están en el ticket)
      cart.products = cart.products.filter(cartItem =>
        !ticket.products.some(ticketItem => ticketItem.productId.equals(cartItem.product._id))
      );

      await cartRepository.updateCart(cart._id, cart);  // Actualizar el carrito sin los productos comprados

      return res.redirect(`/purchase/${ticket._id}`)

    } catch (error) {
      return res.status(500).render('error', {
        title: 'Error',
        message: 'Hubo un problema al confirmar la compra.',
        description: error.message,
        buttons: [{ text: 'Volver al carrito', href: '/cart' }]
      });
    }
  };
}

export default new TicketController();
