export default class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    async createUser(req, res) {
        try {
            const newUser = await this.userService.createUser(req.body);
            res.status(201).json({ status: "success", payload: newUser });
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: "Error creating user",
                error: error.message,
            });
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await this.userService.getAllUsers();
            res.json({ status: "success", payload: users });
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: "Error fetching users",
                error: error.message,
            });
        }
    }

    async getUser(req, res) {
        try {
            const user = await this.userService.getUser(req.params.id);
            if (!user)
                return res.status(404).json({ status: "error", message: "User not found" });

            res.json({ status: "success", payload: user });
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: "Error fetching user",
                error: error.message,
            });
        }
    }

    async updateUser(req, res) {
        try {
            const updatedUser = await this.userService.updateUser(req.params.id, req.body);
            // If the user is not found, the service/repository might return null
            if (!updatedUser) { 
                return res.status(404).json({ status: "error", message: "User not found for update" });
            }
            res.json({ status: "success", payload: updatedUser });
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: "Error updating user",
                error: error.message,
            });
        }
    }

    async deleteUser(req, res) {
        try {
            await this.userService.deleteUser(req.params.id);
            res.json({ status: "success", message: "User deleted successfully" });
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: "Error deleting user",
                error: error.message,
            });
        }
    }

    async updateTokenId(req, res) {
        try {
            const { userId, tokenId } = req.body;
            await this.userService.updateTokenId(userId, tokenId);
            res.json({ status: "success", message: "Token ID updated successfully" });
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: "Error updating token ID",
                error: error.message,
            });
        }
    }
}