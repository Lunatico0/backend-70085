import TicketModel from "./models/ticket.model.js";

class TicketDAO {
  async createTicket(ticketData) {
    const ticket = new TicketModel(ticketData);
    return await ticket.save();
  }

  async getTicketById(ticketId) {
    return await TicketModel.findById(ticketId);
  }

  async updateTicket(ticketId, updateData) {
    return await TicketModel.findByIdAndUpdate(ticketId, updateData, { new: true });
  }

  async deleteTicket(ticketId) {
    return await TicketModel.findByIdAndDelete(ticketId);
  }
}

export default new TicketDAO();
