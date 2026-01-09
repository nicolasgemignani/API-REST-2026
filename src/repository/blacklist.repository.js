import BlacklistDto from "../dto/blacklist.dto.js";

export default class BlacklistRepository {
    constructor(dao) {
        this.dao = dao;
    }

    /**
     * Creates a new entry in the blacklist.
     * @param {string} token - The JWT token.
     * @param {number} expiresIn - Expiration time in seconds.
     */
    async createBlacklistEntry(token, expiresIn) {
        if (typeof token !== "string" || !token.trim()) {
            throw new Error("Invalid token: must be a non-empty string");
        }

        if (isNaN(expiresIn) || expiresIn <= 0) {
            throw new Error("expiresIn must be a valid positive number");
        }

        const entry = await this.dao.insert(token, expiresIn);
        // Apply DTO transformation before returning
        return new BlacklistDto(entry);
    }

    /**
     * Retrieves a blacklisted token entry.
     * @param {string} token - The token to look for.
     */
    async getToken(token) {
        // DAO handles the query logic { token }
        const entry = await this.dao.getOne({ token });
        // Apply DTO transformation if found
        return entry ? new BlacklistDto(entry) : null;
    }
}