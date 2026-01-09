import userModel from "../models/user.model.js";
import cartModel from "../models/cart.model.js";

export default class UserDaoMongo {
    constructor() {
        this.userModel = userModel;
        this.cartModel = cartModel;
    }

    /**
     * Creates a new user and a dedicated cart for them.
     * @param {Object} data - User data.
     */
    async create(data) {
        const newUser = await this.userModel.create(data);
        const newCart = await this.cartModel.create({ user: newUser._id, products: [] });

        newUser.cart = newCart._id;
        await newUser.save();

        return newUser;
    }

    /**
     * Bulk creation of users and their dedicated carts.
     * @param {Array<Object>} usersData - Array of user data.
     */
    async creates(usersData) {
        return Promise.all(
            usersData.map(async (userData) => {
                const newUser = await this.userModel.create(userData);
                const newCart = await this.cartModel.create({ user: newUser._id, products: [] });

                newUser.cart = newCart._id;
                await newUser.save();

                return newUser;
            })
        );
    }

    async getAll() { return this.userModel.find(); }

    async getOne(filter) { return this.userModel.findOne(filter); }

    async update(userId, data) {
        return this.userModel.findByIdAndUpdate(userId, data, { new: true });
    }

    async delete(userId) { return this.userModel.findByIdAndDelete(userId); }

    async updateTokenId(userId, tokenId) {
        return this.userModel.findByIdAndUpdate(userId, { tokenId }, { new: true });
    }
}