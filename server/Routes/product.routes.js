import express from "express";
import { verifyRestaurantJWT } from "../Middlewares/auth.middleware.js";
import { addProduct, deleteProduct, getAllProducts, getAllProductsOfRestaurant, getProductById, updateProductDetails, updateProductStatus } from "../Controller/product.controller.js";

const router = express.Router();

//Restaurant Operations:
router.post("/add", verifyRestaurantJWT, addProduct);
router.delete("/delete/:productId", verifyRestaurantJWT, deleteProduct);
router.patch("/update/:productId", verifyRestaurantJWT, updateProductDetails);
router.patch("/update-status/:productId", verifyRestaurantJWT, updateProductStatus);


//(Restuarant + Customer) Common Operations:
router.get("/:productId", getProductById);
router.get("/r/:restaurantId", getAllProductsOfRestaurant)
router.get("/all/allProducts", getAllProducts);


//TODO: Add routes for upload or change product images.





export default router;