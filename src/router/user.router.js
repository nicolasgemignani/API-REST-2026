// router/UserRouter.js
import BaseRouter from "./base.router.js";

export default class UserRouter extends BaseRouter {
    constructor(userController) {
        super();
        this.controller = userController;
    }

    init() {
        // [POST] /users (Private - Admin only)
        this.post("/", 'admin', this.controller.createUser);

        // [GET] /users (Private - Admin only)
        this.get("/", 'admin', this.controller.getAllUsers);

        // [GET] /users/:id (Private - Admin only. Podría ser 'USER' si se consulta a sí mismo)
        this.get("/:id", 'admin', this.controller.getUser);

        // [PUT] /users/:id (Private - Admin only. Podría ser 'USER' si se actualiza a sí mismo)
        this.put("/:id", 'admin', this.controller.updateUser);

        // [DELETE] /users/:id (Private - Admin only)
        this.delete("/:id", 'admin', this.controller.deleteUser);
    }
}