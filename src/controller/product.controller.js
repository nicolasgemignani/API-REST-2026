// controllers/ProductController.js

export default class ProductController {
    /**
     * @param {import('../../service/ProductService.js').default} productService
     */
    constructor(productService) {
        this.productService = productService;
    }

    // Create product
    async createProduct(req, res) {
        try {
            // Delegation to the Service (Service handles business validation)
            const newProduct = await this.productService.createProduct(req.body);
            res.status(201).json({ status: "success", payload: newProduct });
        } catch (error) {
            // Service errors usually indicate bad data (400) or conflict (409)
            const status = error.message.includes('exists') ? 409 : 400; 
            res.status(status).json({ status: "error", message: error.message });
        }
    }

    // Get all products with pagination
    async getAllProducts(req, res) {
        try {
            const options = {
                limit: parseInt(req.query.limit) || 10,
                page: parseInt(req.query.page) || 1,
                sort: req.query.sort || "price:1",
                query: req.query.query ? JSON.parse(req.query.query) : {}
            };

            const products = await this.productService.getAllProducts(options);
            res.status(200).json({ status: "success", payload: products });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    }

    // Get single product by ID
    async getProductById(req, res) {
        try {
            const { id } = req.params;
            const product = await this.productService.getProductById(id);
            res.status(200).json({ status: "success", payload: product });
        } catch (error) {
            // Service throws "Product not found"
            res.status(404).json({ status: "error", message: error.message }); 
        }
    }

    // Update product
    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const updated = await this.productService.updateProduct(id, req.body);
            res.status(200).json({ status: "success", payload: updated });
        } catch (error) {
            // Service throws "Product not found"
            res.status(404).json({ status: "error", message: error.message }); 
        }
    }

    // Delete product
    async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            await this.productService.deleteProduct(id);
            res.status(200).json({ status: "success", message: "Product deleted successfully" });
        } catch (error) {
            // Service throws "Product not found"
            res.status(404).json({ status: "error", message: error.message });
        }
    }
}