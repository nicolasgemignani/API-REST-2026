class TicketDto {
    constructor({ _id, code, purchaseDate, amount, purchaser, createdAt, updatedAt }) {
        this.id = _id;
        this.code = code;
        this.purchaseDate = purchaseDate;
        this.amount = amount;
        this.purchaser = purchaser;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export default TicketDto;