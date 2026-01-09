import BlacklistModel from "../models/blacklist.model.js";

export default class BlacklistDaoMongo {
    constructor() {
        this.model = BlacklistModel;
    }

    /**
     * Inserts a token into the blacklist with an expiration time.
     * @param {string} token - The JWT token to blacklist.
     * @param {number} expiresIn - Expiration time in seconds.
     */
    async insert(token, expiresIn) {
        if (typeof token !== "string" || token.trim() === "") {
            throw new Error("Invalid token: must be a non-empty string.");
        }

        if (isNaN(expiresIn) || expiresIn <= 0) {
            throw new Error("expiresIn must be a valid positive number.");
        }

        const expirationDate = new Date(Date.now() + expiresIn * 1000);

        const blacklistedToken = new this.model({
            token,
            expiresAt: expirationDate,
        });

        return await blacklistedToken.save();
    }

    /**
     * Retrieves a blacklisted token based on a filter.
     * @param {Object} filter - MongoDB filter object (e.g. { token: "xyz" }).
     */
    async getOne(filter) {
        return await this.model.findOne(filter);
    }
}