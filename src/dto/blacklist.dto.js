class BlacklistDto {
    constructor(data) {
        this.id = data._id;
        this.token = data.token;
        this.expiresAt = data.expiresAt;
    }
}

export default BlacklistDto;
