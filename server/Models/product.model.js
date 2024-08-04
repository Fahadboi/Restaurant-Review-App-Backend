import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        trim: true,
    },

    owner: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
    },

    price: {
        type: Number,
        required: true,
    },

    discount: {
        type: String,
        default: '0.00',
    },

    images: [
        {
            type: String,
        }
    ],

    category: {
        type: String,
        required: true,
        trim: true,
    },

    status: {
        type: String,
        enum: ["AVAILABLE", "DISCONTINUED", "OUT_OF_STOCK"],
        default: "AVAILABLE",
    },

},{ timestamps: true});


export const Product = mongoose.model("Product", productSchema);