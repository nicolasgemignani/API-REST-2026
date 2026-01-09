// controllers/MockingController.js

import { generateMockProducts, generateMockUsers } from "../utils/mocking/mocking.js";

export default class MockingController {
    /**
     * @param {import('../../service/ProductService.js').default} productService 
     * @param {import('../../service/UserService.js').default} userService 
     */
    constructor(productService, userService) {
        this.productService = productService;
        this.userService = userService;
    }

    async createUsers(req, res) {
        try {
            const mockUsers = generateMockUsers(50);
            // NOTE: This controller method only generates mocks, it does not save them.
            res.status(200).json({
                status: "success",
                payload: mockUsers,
            });
        } catch (error) {
            console.error("Error generating mock users:", error);
            res.status(500).json({
                status: "error",
                message: "Failed to generate mock users",
            });
        }
    }

    async createProducts(req, res) {
        try {
            const mockProducts = generateMockProducts(50);
            // NOTE: This controller method only generates mocks, it does not save them.
            res.status(200).json({
                status: "success",
                payload: mockProducts,
            });
        } catch (error) {
            console.error("Error generating mock products:", error);
            res.status(500).json({
                status: "error",
                message: "Failed to generate mock products",
            });
        }
    }

    async generateData(req, res) {
        try {
            const mockUsers = generateMockUsers(50);
            const mockProducts = generateMockProducts(50);

            // Call services to save the generated data
            const savedUsers = await this.userService.createUsers(mockUsers);
            const savedProducts = await this.productService.createProducts(mockProducts);

            res.status(201).json({
                status: "success",
                message: "Mock data generated and saved successfully",
                payload: {
                    users: savedUsers,
                    products: savedProducts,
                },
            });
        } catch (error) {
            console.error("Error saving mock data:", error);
            res.status(500).json({
                status: "error",
                message: "Failed to save mock data",
            });
        }
    }

    async getUsers(req, res) {
        try {
            const users = await this.userService.getAllUsers();
            res.status(200).json({
                status: "success",
                payload: users,
            });
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).json({
                status: "error",
                message: "Failed to fetch users",
            });
        }
    }

    async getProducts(req, res) {
        try {
            // Hardcoded options for this mock endpoint
            const options = {
                limit: 100,
                page: 1,
                sort: {},
                query: {},
            };
            const products = await this.productService.getAllProducts(options);

            res.status(200).json({
                status: "success",
                // Assuming payload wants only the documents, not the pagination metadata
                payload: products.docs, 
            });
        } catch (error) {
            console.error("Error fetching products:", error);
            res.status(500).json({
                status: "error",
                message: "Failed to fetch products",
            });
        }
    }
}