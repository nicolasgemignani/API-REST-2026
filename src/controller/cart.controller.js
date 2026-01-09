// controllers/CartController.js

export default class CartController {
    /**
     * @param {import('../../service/CartService.js').default} cartService
     */
    constructor(cartService) {
        this.cartService = cartService;
    }

    async getCart(req, res) {
        if (!req.user || !req.user.cart) {
            return res.status(401).json({ status: "error", message: "User not authenticated or cart ID missing" });
        }

        try {
            // Cart ID is retrieved from the authenticated user object
            const cart = await this.cartService.getCart(req.user.cart); 
            res.json({ status: "success", payload: cart });
        } catch (error) {
            // The service should handle the "Cart not found" error, often leading to a 404
            const status = error.message.includes('not found') ? 404 : 500;
            res.status(status).json({
                status: "error",
                message: "Failed to retrieve cart",
                error: error.message,
            });
        }
    }

    async deleteCart(req, res) {
        const { cartId } = req.params;

        try {
            const result = await this.cartService.deleteCart(cartId);
            res.json({ status: "success", payload: result });
        } catch (error) {
            const status = error.message.includes('not found') ? 404 : 500;
            res.status(status).json({ status: "error", message: error.message });
        }
    }

    async addToCart(req, res) {
        if (!req.user || !req.user.cart) {
            return res.status(401).json({ status: "error", message: "User not authenticated or cart ID missing" });
        }

        try {
            const { quantity } = req.body;
            const { productId } = req.params;

            const updatedCart = await this.cartService.addToCart(
                req.user.cart,
                productId,
                quantity
            );

            res.json({ status: "success", payload: updatedCart });
        } catch (error) {
            const status = error.message.includes('not found') ? 404 : 500;
            res.status(status).json({
                status: "error",
                message: "Failed to add product to cart",
                error: error.message,
            });
        }
    }

    async updateCart(req, res) {
        try {
            const { cartId } = req.params;
            const products = req.body;

            // Controller validation of expected payload structure
            if (!Array.isArray(products) || products.some((p) => !p.product || typeof p.quantity !== 'number')) {
                return res.status(400).json({
                    status: "error",
                    message: "Invalid format. Expected array of { product: string, quantity: number }",
                });
            }

            const updatedCart = await this.cartService.updateCart(cartId, products);

            res.status(200).json({
                status: "success",
                message: "Cart updated successfully",
                payload: updatedCart,
            });
        } catch (error) {
            const status = error.message.includes('not found') ? 404 : 500;
            res.status(status).json({
                status: "error",
                message: "Failed to update cart",
                error: error.message,
            });
        }
    }

    async updateQuantity(req, res) {
        const { cartId, productId } = req.params;
        const { quantity } = req.body;

        try {
            if (typeof quantity !== "number" || quantity <= 0) {
                return res.status(400).json({
                    status: "error",
                    message: "Quantity must be a positive number",
                });
            }

            const updatedCart = await this.cartService.updateQuantity(
                cartId,
                productId,
                quantity
            );

            // The service already throws an error if not found, but we keep this check for safety if the service only returns null
            if (!updatedCart) {
                 return res.status(404).json({
                     status: "error",
                     message: "Cart or product not found",
                 });
            }

            res.status(200).json({ status: "success", payload: updatedCart });
        } catch (error) {
            const status = error.message.includes('not found') ? 404 : 400; // 400 for validation errors, 500 otherwise
            res.status(status).json({
                status: "error",
                message: "Failed to update product quantity",
                error: error.message,
            });
        }
    }

    async removeFromCart(req, res) {
        const { cartId, productId } = req.params;

        try {
            const updatedCart = await this.cartService.removeFromCart(cartId, productId);

            if (!updatedCart) {
                return res.status(404).json({
                    status: "error",
                    message: "Cart or product not found",
                });
            }

            res.status(200).json({
                status: "success",
                message: "Product removed successfully",
                payload: updatedCart,
            });
        } catch (error) {
            const status = error.message.includes('not found') ? 404 : 500;
            res.status(status).json({
                status: "error",
                message: "Failed to remove product from cart",
                error: error.message,
            });
        }
    }

    async emptyCart(req, res) {
        const { cartId } = req.params;

        try {
            const updatedCart = await this.cartService.emptyCart(cartId);

            res.status(200).json({
                status: "success",
                message: "Cart emptied successfully",
                payload: updatedCart,
            });
        } catch (error) {
            const status = error.message.includes('not found') ? 404 : 500;
            res.status(status).json({
                status: "error",
                message: "Failed to empty cart",
                error: error.message,
            });
        }
    }
}