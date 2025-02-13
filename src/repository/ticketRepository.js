import ticketDao from "../dao/ticketDao.js";
import TicketModel from '../dao/models/ticket.model.js';

class TicketRepository {
  async create(ticketData) {
    return await ticketDao.createTicket(ticketData);
  }

  async findById(ticketId) {
    return await TicketModel.findById(ticketId).populate('products.productId')
  }

  async update(ticketId, updateData) {
    return await ticketDao.updateTicket(ticketId, updateData);
  }

  async delete(ticketId) {
    return await ticketDao.deleteTicket(ticketId);
  }
}

export default new TicketRepository();
