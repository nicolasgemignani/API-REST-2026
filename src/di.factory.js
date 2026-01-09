// src/di.factory.js (O donde decidas colocar tu contenedor DI)

// --- 1. Importar Capa de Persistencia (DAOs y Repositories) ---
// Usaremos los Repositories (capa de abstracción) para inyectar en los Services.

// DAOs (Capas de datos, inyectadas en Repositories)
import BlacklistDAO from "./daos/mongo/classes/blacklist.dao.mongo.js";
import CartDAO from "./daos/mongo/classes/cart.dao.mongo.js";
import ProductDAO from "./daos/mongo/classes/product.dao.mongo.js";
import TicketDAO from "./daos/mongo/classes/ticket.dao.mongo.js";
import UserDAO from "./daos/mongo/classes/user.dao.mongo.js";

// Repositories (Capas de negocio, inyectadas en Services)
import BlacklistRepository from "./repository/blacklist.repository.js";
import CartRepository from "./repository/cart.repository.js";
import ProductRepository from "./repository/product.repository.js";
import TicketRepository from "./repository/ticket.repository.js";
import UserRepository from "./repository/user.repository.js";

// --- 2. Importar Capa de Lógica de Negocio (Services) ---
import BlacklistService from "./service/blacklist.service.js";
import CartService from "./service/cart.service.js";
import ProductService from "./service/product.service.js";
import TicketService from "./service/ticket.service.js";
import UserService from "./service/user.service.js";

// --- 3. Importar Capa de Presentación (Controllers) ---
import BlacklistController from "./controller/blacklist.controller.js";
import CartController from "./controller/cart.controller.js";
import MockingController from "./controller/mocking.controller.js";
import ProductController from "./controller/product.controller.js";
import SessionController from "./controller/session.controller.js";
import TicketController from "./controller/ticket.controller.js";
import UserController from "./controller/user.controller.js";

// --- 4. Importar Capa de Enrutamiento (Routers) ---
import BlacklistRouter from "./router/blacklist.router.js";
import CartRouter from "./router/cart.router.js";
import MockingRouter from "./router/mocks.router.js";
import ProductRouter from "./router/product.router.js";
import SessionRouter from "./router/session.router.js";
import TicketRouter from "./router/ticket.router.js";
import UserRouter from "./router/user.router.js";

// ==========================================================
// 🚀 1. ENSAMBLAJE DE DAOs y REPOSITORIES
// ==========================================================

// DAOs (Instancias de la capa de datos)
const blacklistDAO = new BlacklistDAO();
const cartDAO = new CartDAO();
const productDAO = new ProductDAO();
const ticketDAO = new TicketDAO();
const userDAO = new UserDAO();

// Repositories (Inyectan DAOs)
const blacklistRepository = new BlacklistRepository(blacklistDAO);
const cartRepository = new CartRepository(cartDAO);
const productRepository = new ProductRepository(productDAO);
const ticketRepository = new TicketRepository(ticketDAO);
const userRepository = new UserRepository(userDAO);

// ==========================================================
// 🧠 2. ENSAMBLAJE DE SERVICES (Inyectan Repositories)
// ==========================================================

export const productService = new ProductService(productRepository);
export const blacklistService = new BlacklistService(blacklistRepository);
export const ticketService = new TicketService(ticketRepository);
export const userService = new UserService(userRepository);
export const cartService = new CartService(cartRepository, productService); 

// ==========================================================
// 🎛️ 3. ENSAMBLAJE DE CONTROLLERS (Inyectan Services)
// ==========================================================

export const blacklistController = new BlacklistController(blacklistService);
export const cartController = new CartController(cartService);
export const mockingController = new MockingController(productService, userService);
export const productController = new ProductController(productService);
export const sessionController = new SessionController(userService);
export const ticketController = new TicketController(ticketService);
export const userController = new UserController(userService);

// ==========================================================
// 🛣️ 4. ENSAMBLAJE DE ROUTERS (Inyectan Controllers) - ¡CORREGIDO!
// ==========================================================

// --- Función para instanciar, inicializar y exportar ---
const createRouter = (RouterClass, controller) => {
    const instance = new RouterClass(controller);
    instance.init(); // ⬅️ Llama a init() DESPUÉS de que el controller fue inyectado
    return instance.getRouter();
}

export const blacklistRouter = createRouter(BlacklistRouter, blacklistController);
export const cartRouter = createRouter(CartRouter, cartController);
export const mockingRouter = createRouter(MockingRouter, mockingController);
export const productRouter = createRouter(ProductRouter, productController);
export const sessionRouter = createRouter(SessionRouter, sessionController);
export const ticketRouter = createRouter(TicketRouter, ticketController);
export const userRouter = createRouter(UserRouter, userController);