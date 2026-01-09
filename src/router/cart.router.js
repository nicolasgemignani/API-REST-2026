// router/CartRouter.js
import BaseRouter from "./base.router.js";
// Importamos solo la CLASE del Controller
import CartController from "../controller/cart.controller.js"; 

export default class CartRouter extends BaseRouter {
    constructor(cartController) {
        super();
        this.controller = cartController;
    }

    init() {
        // [GET] /carts/:cartId - Get cart by ID 
        this.get(
            "/:cartId", 
            'USER', // Policy: Requires authentication (USER or ADMIN)
            this.controller.getCart
        );

        // [POST] /carts/products/:productId - Add product to user’s cart (Uses req.user.cart internally)
        this.post(
            "/products/:productId", 
            'USER', 
            this.controller.addToCart
        );

        // [PUT] /carts/:cartId - Replace all products in the cart
        this.put(
            "/:cartId", 
            'USER', 
            this.controller.updateCart
        );

        // [PUT] /carts/:cartId/product/:productId - Update quantity of a specific product
        this.put(
            "/:cartId/product/:productId", 
            'USER', 
            this.controller.updateQuantity
        );

        // [DELETE] /carts/:cartId/products/:productId - Remove a specific product from the cart
        this.delete(
            "/:cartId/products/:productId", 
            'USER', 
            this.controller.removeFromCart
        );
        
        // [DELETE] /carts/:cartId - Empty the cart (remove all products)
        this.delete(
            "/:cartId", 
            'USER', 
            this.controller.emptyCart
        );
        
        // [DELETE] /carts/remove/:cartId - Delete cart completely from the system (Admin or specific policy)
        // Nota: Mantenemos la ruta /remove/:cartId como en tu original.
        this.delete(
            "/remove/:cartId", 
            'ADMIN', // Policy: Deleting the cart entity is typically an Admin task
            this.controller.deleteCart
        );
    }
}