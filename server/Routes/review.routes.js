import express from "express";
import { verifyCustomerJWT, verifyRestaurantJWT } from "../Middlewares/auth.middleware.js";
import { addReview, deleteReviewByCustomer, deleteReviewByRestaurant, getAllRestaurantReviews, getAllReviewsOfProduct, updateReview } from "../Controller/review.controller.js";

const router = express.Router();

//For Customer:
router.post("/c/add", verifyCustomerJWT, addReview);
router.patch("/c/update/:reviewId", verifyCustomerJWT, updateReview);
router.delete("/c/delete/:reviewId", verifyCustomerJWT, deleteReviewByCustomer);

//For Restaurant
router.get("/r/get/all", verifyRestaurantJWT, getAllRestaurantReviews); //All review of restaurant
router.delete("/r/delete/:reviewId", verifyRestaurantJWT, deleteReviewByRestaurant);

//Common (Restaurant, Customer):
router.get("/get/:productId", getAllReviewsOfProduct);

export default router;