// router/api/index.router.js (Actualizado)

import { Router } from 'express';
// Importamos los routers YA INSTANCIADOS y CONFIGURADOS del DI Container
import { 
    sessionRouter, 
    userRouter, 
    productRouter, 
    cartRouter, 
    mockingRouter, 
    blacklistRouter,
    ticketRouter // No estaba en tu index, pero lo añadimos.
} from '../di.factory.js'; 

const router = Router();

// Auth & sessions
router.use('/sessions', sessionRouter);

// Users
router.use('/users', userRouter);

// Products
router.use('/products', productRouter);

// Carts
router.use('/carts', cartRouter);

// Tickets (Añadido)
router.use('/tickets', ticketRouter);

// Mocking (para testing)
router.use('/mocking', mockingRouter);

// Admin / security (Generalmente se ubica bajo /admin o /security)
// Nota: Aquí se usa '/admin' como prefijo en tu original, pero tu router se llama blacklist.router.js
// Si el BlacklistRouter tiene rutas como '/' y lo montas en '/admin', las rutas serán /admin/
router.use('/admin', blacklistRouter); 

export default router;