import UserAlreadyExistsError from "../errors/userAlreadyExists.error.js";
import NotFoundError from "../errors/notFound.error.js";

export default class UserService {
    constructor(repository) {
        this.repository = repository;
    }

    async createUser(data) {
        const existingUser = await this.repository.getUser({ email: data.email });

        if (existingUser) throw new UserAlreadyExistsError(data.email)
        
        return this.repository.createUser(data); 
    }

    async createUsers(data) { return this.repository.createUsers(data); }

    async getAllUsers() { return this.repository.getAllUsers(); }

    async getUser(filter) {
        const user = await this.repository.getUser(filter);
        if (!user) throw new NotFoundError("Usuario");
        return user; 
    } 

    async updateUser(id, data) { return this.repository.updateUser(id, data); }

    async deleteUser(id) { return this.repository.deleteUser(id); }

    async updateTokenId(id, tokenId) { return this.repository.updateTokenId(id, tokenId); }

    async validatePassword(email, password) { return this.repository.validatePassword(email, password) };
}