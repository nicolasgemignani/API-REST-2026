import ProductDto from "../dto/product.dto.js";

export default class ProductRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async createProduct(data) {
        const newProduct = await this.dao.create(data);
        return new ProductDto(newProduct);
    }

    async createManyProducts(products) {
        const inserted = await this.dao.creates(products);
        return inserted.map(prod => new ProductDto(prod));
    }

    async getAllProducts(options) {
        const { limit, page, sort, query } = options;

        // Logic to parse the string sort parameter (e.g., "price:1")
        const parseSort = () => {
            if (typeof sort === "string") {
                const [field, order] = sort.split(":");
                return { [field]: Number(order) };
            }
            return sort;
        };

        const result = await this.dao.getAll({
            limit,
            page,
            sort: parseSort(),
            query,
        });

        // Map paginated documents to DTOs
        return {
            ...result,
            docs: result.docs.map(prod => new ProductDto(prod))
        };
    }

    async getProductById(id) {
        const product = await this.dao.getOne(id);
        if (!product) return null;
        return new ProductDto(product);
    }

    // You might want to add getProductByCode or similar here for service validation (optional)
    async getProductByCode(code) {
        const product = await this.dao.getOne({ code: code });
        if (!product) return null;
        return new ProductDto(product);
    }
    
    async updateProduct(id, data) {
        const updated = await this.dao.update(id, data);
        if (!updated) return null;
        return new ProductDto(updated);
    }

    async deleteProduct(id) {
        // Returns the result of the DAO delete operation (e.g., deleted object or result count)
        return await this.dao.delete(id); 
    }
}