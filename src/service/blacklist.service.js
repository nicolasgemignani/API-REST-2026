export default class BlacklistService {
    constructor(repository) {
        this.repository = repository;
    }

    async addToBlacklist(token, expiresIn) {
        return this.repository.createBlacklistEntry(token, expiresIn);
    }

    async getBlacklistedToken(token) {
        return this.repository.getToken(token);
    }
}