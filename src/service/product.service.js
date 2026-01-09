// services/ProductService.js

export default class ProductService {
    /**
     * @param {import('../repository/product.repository.js').default} repository
     */
    constructor(repository) {
        // CORRECCIÓN: Ahora recibimos el Repositorio por DI
        this.repository = repository; 
    }

    async createProduct(data) {
        // BUSINESS VALIDATIONS
        if (!data.title || !data.description || !data.price || !data.code) {
            throw new Error("Missing required fields");
        }

        if (data.price < 0) {
            throw new Error("Price must be positive");
        }

        // Check if product CODE already exists (using repository method)
        // Nota: Asumo que en tu ProductRepository implementaste getProductByCode o similar
        const existing = await this.repository.getProductByCode(data.code); 
        if (existing) {
             throw new Error("Product code already exists");
        }

        // Delegate to Repository
        return await this.repository.createProduct(data);
    }

    async getAllProducts(options) {
        return this.repository.getAllProducts(options);
    }

    async getProductById(id) {
        // Renombramos el método en el service para ser explícito
        const product = await this.repository.getProductById(id); 
        if (!product) {
            throw new Error("Product not found");
        }
        return product;
    }

    async updateProduct(id, data) {
        const updated = await this.repository.updateProduct(id, data);
        if (!updated) {
            throw new Error("Product not found");
        }
        return updated;
    }

    async deleteProduct(id) {
        const deleted = await this.repository.deleteProduct(id);
        // Dependiendo de lo que retorne el DAO/Repository (objeto eliminado o resultado):
        // if (!deleted || (deleted.deletedCount && deleted.deletedCount === 0)) {
        if (!deleted) { // Simplificamos basándonos en tu implementación original
             throw new Error("Product not found");
        }
        return deleted;
    }
}