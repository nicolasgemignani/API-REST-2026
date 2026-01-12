// router/SessionRouter.js
import BaseRouter from "./base.router.js";

export default class SessionRouter extends BaseRouter {
    constructor(sessionController) {
        super();
        this.controller = sessionController;
    }

    init() {
        // [POST] /sessions/register (Public)
        this.post('/register', 'PUBLIC', this.controller.register);

        // [POST] /sessions/login (Public)
        this.post('/login', 'PUBLIC', this.controller.login);

        // [POST] /sessions/refresh-token
        this.post('/refresh-token', 'user', this.controller.refreshToken);

        // [POST] /sessions/logout (Private - Any authenticated user)
        this.post('/logout', 'user', this.controller.logout);

        // [GET] /sessions/current (Private - Any authenticated user)
        this.get('/current', 'user', this.controller.current);
    }
}