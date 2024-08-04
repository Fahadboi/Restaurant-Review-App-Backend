import mongoose, { Schema } from "mongoose";

// Define the rating schema
const reviewSchema = new Schema({
  // Reference to the product being rated
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  // Reference to the customer who gave the rating
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  
  // The rating value, e.g., 1-5 stars
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  // The comment or review provided by the customer
  comment: {
    type: String,
    trim: true,
  },

  image: {
    type: String,
  }
}, { timestamps: true});

// Create the Rating model
const Review = mongoose.model("Review", reviewSchema);

export default Review;
