import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collectionName = "products";

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 80,
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500,
        },
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        status: {
            type: Boolean,
            default: true
        },
        stock: {
            type: Number,
            required: true,
            min: 0
        },
        category: {
            type: String,
            required: true,
            trim: true
        },
        thumbnail: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

productSchema.plugin(mongoosePaginate);

const ProductModel = mongoose.model(collectionName, productSchema);

export default ProductModel;