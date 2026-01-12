import { NotFoundError, DuplicateResourceError } from "../errors/index.js";

export default class ProductController {
    constructor(productService) {
        this.productService = productService;
    }

    async createProduct(req, res, next) {
        try {
            const newProduct = await this.productService.createProduct(req.body);
            res.status(201).json({ status: "success", payload: newProduct });
        } catch (error) {
            // Si el servicio detecta un código duplicado
            if (error.message.includes('exists')) {
                return next(new DuplicateResourceError("Producto", "código"));
            }
            next(error); 
        }
    }

    async getAllProducts(req, res, next) {
        try {
            const { limit, page, sort, query } = req.query;

            let sortOption = {};
            if (sort) {
                if (sort === 'asc') sortOption = { price: 1 };
                else if (sort === 'desc') sortOption = { price: -1 };
                else sortOption = { price: sort === '1' ? 1 : -1 };
            }

            const options = {
                limit: parseInt(limit) || 10,
                page: parseInt(page) || 1,
                sort: sortOption,
                lean: true 
            };

            let filter = {};
            if (query) {
                try {
                    filter = JSON.parse(query);
                } catch (e) {
                    filter = { category: query };
                }
            }

            const products = await this.productService.getAllProducts(filter, options);
            res.status(200).json({ status: "success", payload: products });
        } catch (error) {
            next(error);
        }
    }

    async getProductById(req, res, next) {
        try {
            const { id } = req.params;
            const product = await this.productService.getProductById(id);
            
            if (!product) {
                throw new NotFoundError("Producto");
            }
            
            res.status(200).json({ status: "success", payload: product });
        } catch (error) {
            next(error);
        }
    }

    async updateProduct(req, res, next) {
        try {
            const { id } = req.params;
            const updated = await this.productService.updateProduct(id, req.body);
            
            if (!updated) {
                throw new NotFoundError("Producto");
            }
            
            res.status(200).json({ status: "success", payload: updated });
        } catch (error) {
            next(error);
        }
    }

    async deleteProduct(req, res, next) {
        try {
            const { id } = req.params;
            const result = await this.productService.deleteProduct(id);
            
            // Verificamos si el producto existía para ser borrado
            if (!result) {
                throw new NotFoundError("Producto");
            }
            
            res.status(200).json({ status: "success", message: "Product deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
}