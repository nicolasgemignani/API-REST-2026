// services/CartService.js

export default class CartService {
    /**
     * @param {import('../repository/cart.repository.js').default} repository
     */
    constructor(repository) {
        // CORRECCIÓN: Ahora recibimos el Repositorio por DI
        this.repository = repository; 
    }

    async getCart(cartId) {
        const cart = await this.repository.getCart(cartId);
        if (!cart) throw new Error("Cart not found");
        return cart;
    }

    async addToCart(cartId, productId, quantity = 1) {
        return this.repository.addToCart(cartId, productId, quantity);
    }

    async updateCart(cartId, products) {
        if (!Array.isArray(products)) {
            // Validación de negocio/esquema
            throw new Error("Products must be an array of { product, quantity }"); 
        }
        return this.repository.updateCart(cartId, products);
    }

    async updateQuantity(cartId, productId, quantity) {
        // Validación de negocio
        if (quantity < 1) throw new Error("Quantity must be at least 1"); 
        
        const updated = await this.repository.updateQuantity(cartId, productId, quantity);
        if (!updated) throw new Error("Cart or product not found");
        return updated;
    }

    async removeFromCart(cartId, productId) {
        const updated = await this.repository.removeFromCart(cartId, productId);
        if (!updated) throw new Error("Cart or product not found");
        return updated;
    }

    async emptyCart(cartId) {
        return this.repository.emptyCart(cartId);
    }

    async deleteCart(cartId) {
        const result = await this.repository.deleteCart(cartId);
        // Validamos el resultado del repositorio/DAO
        if (result.deletedCount === 0) throw new Error("Cart not found");
        return { message: "Cart deleted successfully" };
    }
}