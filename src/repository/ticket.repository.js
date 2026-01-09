import TicketDto from "../dto/ticket.dto.js";

export default class TicketRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async createTicket(ticketData) {
        const ticket = await this.dao.create(ticketData);
        return new TicketDto(ticket);
    }

    async getTickets() {
        const tickets = await this.dao.getAll();
        return tickets.map(t => new TicketDto(t));
    }

    async getTicket(ticketId) {
        // Using filter object for flexibility as your DAO expects it
        const ticket = await this.dao.getOne({ _id: ticketId }); 
        return ticket ? new TicketDto(ticket) : null;
    }

    async updateTicket(ticketId, updateData) {
        const ticket = await this.dao.update(ticketId, updateData);
        return ticket ? new TicketDto(ticket) : null;
    }

    async deleteTicket(ticketId) {
        const result = await this.dao.deleteBy(ticketId); 
        // Returning the result (which could be the deleted document or a confirmation object)
        return result; 
    }
}