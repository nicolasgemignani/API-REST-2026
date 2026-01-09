import UserResponseDto from "../dto/user.response.dto.js";
import UserInsertDto from "../dto/user.insert.dto.js";

export default class UserRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async createUser(data) {
        const dataToSave = new UserInsertDto(data);
        const user = await this.dao.create(dataToSave);
        return new UserResponseDto(user);
    }

    async createUsers(usersData) {
        const cleanUsersData = usersData.map(u => new UserInsertDto(u));
        const users = await this.dao.creates(cleanUsersData);
        return users.map(u => new UserResponseDto(u));
    }

    async getAllUsers() {
        const users = await this.dao.getAll();
        return users.map((u) => new UserResponseDto(u));
    }

    async getUser(filter) {
        // Determine how to call the DAO based on the filter type
        const user = (typeof filter === "string") ? 
            await this.dao.getOne({ _id: filter }) : // Assuming getOne is used with ID or full filter
            await this.dao.getOne(filter);
        
        return user ? new UserResponseDto(user) : null; 
    }

    async updateUser(userId, data) {
        const user = await this.dao.update(userId, data);
        return user ? new UserResponseDto(user) : null;
    }

    async deleteUser(userId) {
        // Returns the result of the DAO delete operation
        return this.dao.delete(userId); 
    }

    async updateTokenId(userId, tokenId) {
        const user = await this.dao.updateTokenId(userId, tokenId);
        return user ? new UserResponseDto(user) : null;
    }

    async validatePassword(email, password) {
        const user = await this.dao.getOne({ email }); 
        if (!user) return null;

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return null;

        return new UserResponseDto(user);
    }
}