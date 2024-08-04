import express from "express";
import { changePassword, loginCustomer, loginRestaurant, logoutCustomer, logoutRestaurant, refreshAccessToken, registerCustomer, registerRestaurant } from "../Controller/auth.controller.js";
import { verifyCustomerJWT, verifyRestaurantJWT } from "../Middlewares/auth.middleware.js";

const router = express.Router();

//Customer auth routes:
router.post("/register-customer", registerCustomer);
router.post("/login-customer", loginCustomer);
router.post("/logout-customer", verifyCustomerJWT, logoutCustomer);
router.patch('/change-customer-password', verifyCustomerJWT, changePassword);


//Resturant auth routes:
router.post("/register-restaurant", registerRestaurant);
router.post("/login-restaurant", loginRestaurant);
router.post("/logout-restaurant", verifyRestaurantJWT, logoutRestaurant);
router.patch('/change-restaurant-password', verifyRestaurantJWT, changePassword);

//Common:
router.post('/refresh-token', refreshAccessToken);

export default router;