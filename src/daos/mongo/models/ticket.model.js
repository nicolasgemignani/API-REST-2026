import mongoose from "mongoose";

const collectionName = 'tickets';

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true,
        default: function () {
            return 'TKT-' + Math.random().toString(36).substring(2, 10).toUpperCase();
        }
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String, // storing email
        required: true,
        lowercase: true,
        trim: true
    }
}, { timestamps: true });

const TicketModel = mongoose.model(collectionName, ticketSchema);

export default TicketModel;