// services/TicketService.js

export default class TicketService {
    /**
     * @param {import('../repository/ticket.repository.js').default} repository
     */
    constructor(repository) {
        this.repository = repository;
    }

    async createTicket(data) { return this.repository.createTicket(data); }

    async getTickets() { return this.repository.getTickets(); }

    async getTicket(id) { return this.repository.getTicket(id); }

    async updateTicket(id, data) { return this.repository.updateTicket(id, data); }

    async deleteTicket(id) { return this.repository.deleteTicket(id); }
}