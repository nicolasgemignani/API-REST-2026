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

// Blacklist
router.use('/admin', blacklistRouter); 

export default router;