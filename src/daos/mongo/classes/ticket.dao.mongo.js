import TicketModel from "../models/ticket.model.js";

export default class TicketDaoMongo {
    constructor() {
        this.ticketModel = TicketModel;
    }

    async create(data) { return await this.ticketModel.create(data); }
    async getAll() { return await this.ticketModel.find(); }
    async getOne(filter) { return await this.ticketModel.findOne(filter); }
    
    async update(id, updateData) {
        return await this.ticketModel.findByIdAndUpdate(id, updateData, { new: true });
    }
    
    async deleteBy(id) {
        return await this.ticketModel.findByIdAndDelete(id);
    }
}