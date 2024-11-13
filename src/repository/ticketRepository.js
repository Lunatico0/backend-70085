import ticketDao from "../dao/ticketDao.js";

class TicketRepository {
  async create(ticketData) {
    return await ticketDao.createTicket(ticketData);
  }

  async findById(ticketId) {
    return await ticketDao.getTicketById(ticketId);
  }

  async update(ticketId, updateData) {
    return await ticketDao.updateTicket(ticketId, updateData);
  }

  async delete(ticketId) {
    return await ticketDao.deleteTicket(ticketId);
  }
}

export default new TicketRepository();
