// router/MockingRouter.js
import BaseRouter from "./base.router.js";

export default class MockingRouter extends BaseRouter {
    constructor(mockingController) {
        super();
        this.controller = mockingController;
    }

    init() {
        // [GET] /mocking/users (Public/Dev Tool)
        this.get('/mockingusers', 'PUBLIC', this.controller.createUsers);
        
        // [GET] /mocking/products (Public/Dev Tool)
        this.get('/mockinproducts', 'PUBLIC', this.controller.createProducts);
        
        // [POST] /mocking/generatedata (Private - Admin/Dev Tool)
        this.post('/generatedata', 'ADMIN', this.controller.generateData);
        
        // [GET] /mocking/users (Public/Dev Tool)
        this.get('/users', 'PUBLIC', this.controller.getUsers);
        
        // [GET] /mocking/products (Public/Dev Tool)
        this.get('/products', 'PUBLIC', this.controller.getProducts);
    }
}