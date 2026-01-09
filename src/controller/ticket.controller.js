// controllers/TicketController.js

export default class TicketController {
    /**
     * @param {import('../../service/TicketService.js').default} ticketService
     */
    constructor(ticketService) {
        this.ticketService = ticketService;
    }

    async createTicket(req, res) {
        try {
            const { amount, purchaser } = req.body;

            if (!amount || !purchaser) {
                return res.status(400).json({
                    status: "error",
                    message: "Required fields: amount and purchaser"
                });
            }

            const ticketData = { amount, purchaser };
            // Delegation to service
            const newTicket = await this.ticketService.createTicket(ticketData);

            return res.status(201).json({
                status: "success",
                message: "Ticket created successfully",
                payload: newTicket
            });

        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: "Failed to create ticket",
                error: error.message
            });
        }
    }

    async getTickets(req, res) {
        try {
            const tickets = await this.ticketService.getTickets();

            return res.status(200).json({
                status: "success",
                payload: tickets
            });

        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: "Failed to fetch tickets",
                error: error.message
            });
        }
    }

    async getTicket(req, res) {
        try {
            const { ticketId } = req.params;

            const ticket = await this.ticketService.getTicket(ticketId);

            if (!ticket) {
                return res.status(404).json({
                    status: "error",
                    message: `Ticket with ID ${ticketId} not found`
                });
            }

            return res.status(200).json({
                status: "success",
                payload: ticket
            });

        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: "Failed to fetch ticket",
                error: error.message
            });
        }
    }

    async updateTicket(req, res) {
        try {
            const { ticketId } = req.params;
            const updateData = req.body;

            const updatedTicket = await this.ticketService.updateTicket(ticketId, updateData);

            if (!updatedTicket) {
                return res.status(404).json({
                    status: "error",
                    message: `Ticket with ID ${ticketId} not found`
                });
            }

            return res.status(200).json({
                status: "success",
                message: "Ticket updated successfully",
                payload: updatedTicket
            });

        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: "Failed to update ticket",
                error: error.message
            });
        }
    }

    async deleteTicket(req, res) {
        try {
            const { ticketId } = req.params;

            const deletedTicket = await this.ticketService.deleteTicket(ticketId);

            // Assuming the Repository/Service returns the deleted object or a non-null result
            if (!deletedTicket) { 
                return res.status(404).json({
                    status: "error",
                    message: `Ticket with ID ${ticketId} not found`
                });
            }

            return res.status(200).json({
                status: "success",
                message: "Ticket deleted successfully",
                payload: deletedTicket
            });

        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: "Failed to delete ticket",
                error: error.message
            });
        }
    }
}