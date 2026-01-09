// router/BlacklistRouter.js
import BaseRouter from "./base.router.js";

export default class BlacklistRouter extends BaseRouter {
    constructor(blacklistController) {
        super();
        this.controller = blacklistController;
    }

    init() {
        // [POST] /admin/blacklist/ (Private - Admin only, used to blacklist manually)
        this.post('/', 'ADMIN', this.controller.addToBlacklist);

        // [GET] /admin/blacklist/:token (Private - Admin only, used to check token status)
        // Nota: En un flujo real, este check se haría en un middleware antes del controller.
        this.get('/:token', 'ADMIN', this.controller.getTokenBlacklist);
    }
}