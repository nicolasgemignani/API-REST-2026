import CartDTO from "../dto/cart.dto.js";

export default class CartRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async createCart(userId) {
        const cart = await this.dao.create(userId);
        return new CartDTO(cart);
    }

    async getCart(cartId) {
        const cart = await this.dao.getOne(cartId);
        return cart ? new CartDTO(cart) : null;
    }

    async deleteCart(cartId) {
        // Returns the result object from the DAO (e.g., { deletedCount: 1 })
        return this.dao.delete(cartId); 
    }

    async addToCart(cartId, productId, qty) {
        const cart = await this.dao.addToCart(cartId, productId, qty);
        return new CartDTO(cart);
    }

    async updateCart(cartId, products) {
        const cart = await this.dao.updateCart(cartId, products);
        return new CartDTO(cart);
    }

    async updateQuantity(cartId, productId, quantity) {
        const cart = await this.dao.updateQuantity(cartId, productId, quantity);
        return cart ? new CartDTO(cart) : null;
    }

    async removeFromCart(cartId, productId) {
        const cart = await this.dao.removeFromCart(cartId, productId);
        return cart ? new CartDTO(cart) : null;
    }

    async emptyCart(cartId) {
        const cart = await this.dao.empty(cartId);
        return new CartDTO(cart);
    }
}