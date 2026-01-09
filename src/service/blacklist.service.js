// services/BlacklistService.js

export default class BlacklistService {
    /**
     * @param {import('../repository/blacklist.repository.js').default} repository
     */
    constructor(repository) {
        this.repository = repository;
    }

    /**
     * Adds a token to the blacklist.
     * @param {string} token 
     * @param {number} expiresIn 
     */
    async addToBlacklist(token, expiresIn) {
        return this.repository.createBlacklistEntry(token, expiresIn);
    }

    /**
     * Retrieves a blacklisted token entry.
     * @param {string} token 
     */
    async getBlacklistedToken(token) {
        return this.repository.getToken(token);
    }
}