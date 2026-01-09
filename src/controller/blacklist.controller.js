// controllers/BlacklistController.js

export default class BlacklistController {
    /**
     * @param {import('../../service/BlacklistService.js').default} blacklistService
     */
    constructor(blacklistService) {
        this.blacklistService = blacklistService;
    }

    async addToBlacklist(req, res) {
        try {
            const { token, expiresIn } = req.body;

            // Minimal validation in the controller
            if (!token || typeof token !== "string") {
                return res.status(400).json({ error: "Invalid token" });
            }

            if (isNaN(expiresIn) || expiresIn <= 0) {
                return res.status(400).json({ error: "Invalid expiresIn value" });
            }

            await this.blacklistService.addToBlacklist(token, expiresIn);

            return res.status(201).json({
                message: "Token successfully added to blacklist",
            });
        } catch (error) {
            console.error("Error adding token to blacklist:", error);
            // Catching generic errors from the service/repository
            return res.status(500).json({
                error: "Internal server error while adding token to blacklist",
            });
        }
    }

    async getTokenBlacklist(req, res) {
        try {
            // Assuming the token ID is extracted by a previous middleware (e.g., JWT strategy)
            const { tokenId } = req.user; 

            if (!tokenId) {
                return res.status(400).json({ message: "TokenId is required" });
            }

            const entry = await this.blacklistService.getBlacklistedToken(tokenId);

            if (!entry) {
                return res.status(404).json({ message: "Token not found in blacklist" });
            }

            res.status(200).json({ token: entry });
        } catch (error) {
            console.error("Error retrieving blacklist token:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}