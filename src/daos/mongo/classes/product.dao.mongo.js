import productModel from "../models/product.model.js";

export default class ProductDaoMongo {
    constructor() {
        this.model = productModel;
    }

    /**
     * Creates a single product.
     * @param {Object} data - Product data.
     */
    async create(data) {
        return await this.model.create(data);
    }

    /**
     * Creates multiple products.
     * @param {Array<Object>} data - Array of product data.
     */
    async creates(data) {
        return await this.model.insertMany(data);
    }

    /**
     * Retrieves products with pagination, search, sort, and limit.
     */
    async getAll({ limit = 10, page = 1, sort = { price: 1 }, query = {} }) {
        const options = {
            limit,
            page,
            sort,
            lean: true
        };
        // Assuming the model uses mongoose-paginate-v2 or similar
        return await this.model.paginate(query, options); 
    }

    /**
     * Retrieves a single product by ID or filter.
     * @param {string|Object} filter - Product ID or MongoDB filter.
     */
    async getOne(filter) {
        if (typeof filter === "string") {
            return await this.model.findById(filter).lean();
        }
        return await this.model.findOne(filter).lean();
    }

    /**
     * Updates a product by ID.
     * @param {string} id - Product ID.
     * @param {Object} data - Update data.
     */
    async update(id, data) {
        return await this.model.findByIdAndUpdate(id, data, {
            new: true,
            lean: true
        });
    }

    /**
     * Deletes a product by ID.
     * @param {string} id - Product ID.
     */
    async delete(id) {
        return await this.model.findByIdAndDelete(id);
    }
}