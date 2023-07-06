import ticketsDAO from "../persistence/DAOs/ticketsDAO/ticketsMongo.js";

class TicketsService {
  constructor() {
    this.dao = ticketsDAO;
  }
  async getTicketsByPurchaser(purchaserEmail) {
    const tickets = await this.dao.getTicketsByPurchaser(purchaserEmail);
    return tickets;
  }
}

export default new TicketsService();
