// router/TicketRouter.js
import BaseRouter from "./base.router.js";

export default class TicketRouter extends BaseRouter {
    constructor(ticketController) {
        super();
        this.controller = ticketController;
    }

    init() {
        // [POST] /tickets (Private - User)
        this.post("/", 'USER', this.controller.createTicket);

        // [GET] /tickets (Private - Admin only)
        this.get("/", 'ADMIN', this.controller.getTickets);

        // [GET] /tickets/:ticketId (Private - User/Admin)
        this.get("/:ticketId", 'USER', this.controller.getTicket);

        // [PUT] /tickets/:ticketId (Private - Admin only)
        this.put("/:ticketId", 'ADMIN', this.controller.updateTicket);

        // [DELETE] /tickets/:ticketId (Private - Admin only)
        this.delete("/:ticketId", 'ADMIN', this.controller.deleteTicket);
    }
}