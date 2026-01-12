import BlacklistDto from "../dto/blacklist.dto.js";

export default class BlacklistRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async createBlacklistEntry(token, expiresIn) {
        if (typeof token !== "string" || !token.trim()) {
            throw new Error("Invalid token: must be a non-empty string");
        }

        if (isNaN(expiresIn) || expiresIn <= 0) {
            throw new Error("expiresIn must be a valid positive number");
        }

        const expiresAt = new Date(Date.now() + expiresIn * 1000);

        const entry = await this.dao.insert({ 
            token, 
            expiresAt 
        });
        // Apply DTO transformation before returning
        return new BlacklistDto(entry);
    }
    
    async getToken(token) {
        if (!token || typeof token !== 'string') {
            return null; // O lanzar un error, según prefieras
        }
        const entry = await this.dao.getOne({ token });
        return entry ? new BlacklistDto(entry) : null;
    }
}