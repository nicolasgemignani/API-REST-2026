import CartModel from "../models/cart.model.js";

export default class CartDaoMongo {
    constructor() {
        this.model = CartModel;
    }

    /**
     * Creates a new cart for a user.
     * @param {string} userId - The ID of the user.
     */
    async create(userId) {
        return await this.model.create({ user: userId, products: [] });
    }

    /**
     * Retrieves a cart by its ID.
     * @param {string} cartId - The ID of the cart.
     */
    async getOne(cartId) {
        return await this.model.findById(cartId);
    }

    /**
     * Deletes a cart by its ID.
     * @param {string} cartId - The ID of the cart.
     */
    async delete(cartId) {
        return await this.model.deleteOne({ _id: cartId });
    }

    /**
     * Adds a product to the cart or increases its quantity.
     */
    async addToCart(cartId, productId, quantity = 1) {
        const cart = await this.model.findById(cartId);
        if (!cart) throw new Error("Cart not found");

        const updateResult = await this.model.updateOne(
            { _id: cartId, "products.product": productId },
            { $inc: { "products.$.quantity": quantity } }
        );

        if (updateResult.modifiedCount === 0) {
            cart.products.push({ product: productId, quantity });
            await cart.save();
        }

        return cart;
    }

    /**
     * Replaces cart products with a new array of products.
     */
    async updateCart(cartId, newProducts) {
        const cart = await this.model.findById(cartId);
        if (!cart) throw new Error("Cart not found");

        const map = Object.fromEntries(
            newProducts.map(({ product, quantity }) => [product.toString(), quantity])
        );

        cart.products = [
            ...cart.products
                .filter((p) => map[p.product.toString()])
                .map((p) => ({ product: p.product, quantity: map[p.product.toString()] })),
            ...newProducts.filter(
                ({ product }) =>
                    !cart.products.some((p) => p.product.toString() === product.toString())
            ),
        ];

        return await cart.save();
    }

    /**
     * Updates the quantity of a specific product in the cart.
     */
    async updateQuantity(cartId, productId, quantity) {
        return await this.model.findByIdAndUpdate(
            cartId,
            { $set: { "products.$[elem].quantity": quantity } },
            {
                arrayFilters: [{ "elem.product": productId }],
                new: true,
            }
        );
    }

    /**
     * Removes a product from the cart.
     */
    async removeFromCart(cartId, productId) {
        return await this.model.findByIdAndUpdate(
            cartId,
            { $pull: { products: { product: productId } } },
            { new: true }
        );
    }

    /**
     * Empties the cart by removing all products.
     */
    async empty(cartId) {
        return await this.model.findByIdAndUpdate(
            cartId,
            { products: [] },
            { new: true }
        );
    }
}