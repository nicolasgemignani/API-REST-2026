// router/ProductRouter.js
import BaseRouter from "./base.router.js";

export default class ProductRouter extends BaseRouter {
    constructor(productController) {
        super();
        // Inyectamos el controller para usarlo en BaseRouter.applyController
        this.controller = productController; 
    }

    init() {
        // [POST] /products (Private - Admin only)
        this.post(
            "/", 
            'admin',
            this.controller.createProduct
        );

        // [GET] /products (Public)
        this.get(
            "/", 
            'public',
            this.controller.getAllProducts
        );

        // [GET] /products/:id (Public)
        this.get(
            "/:id", 
            'public', // Policy: Public access
            this.controller.getProductById
        );

        // [PUT] /products/:id (Private - Admin only)
        this.put(
            "/:id", 
            'admin', // Policy: Requires 'ADMIN' role
            this.controller.updateProduct
        );

        // [DELETE] /products/:id (Private - Admin only)
        this.delete(
            "/:id", 
            'admin', // Policy: Requires 'ADMIN' role
            this.controller.deleteProduct
        );
    }
}