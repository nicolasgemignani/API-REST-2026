import mongoose from "mongoose";

const collectionName = "carts";

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        products: {
            type: [
                {
                    product: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "products",
                        required: true,
                    },
                    quantity: {
                        type: Number,
                        required: true,
                        min: 1,
                    },
                },
            ],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

// Auto-populate product references
cartSchema.pre(/^find/, function () {
    this.populate("products.product");
});

const CartModel = mongoose.model(collectionName, cartSchema);

export default CartModel;