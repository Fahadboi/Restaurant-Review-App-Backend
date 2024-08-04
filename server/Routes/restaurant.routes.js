import express from "express";
import { verifyRestaurantJWT } from "../Middlewares/auth.middleware.js";
import { updateRestaurantName, updateRestaurantAddress, updateRestaurantEmail, updateRestaurantPhoneNo } from "../Controller/restaurant.controller.js";

const router = express.Router();

router.patch("/update-email", verifyRestaurantJWT, updateRestaurantEmail);
router.patch("/update-name", verifyRestaurantJWT, updateRestaurantName);
router.patch("/update-phone-no", verifyRestaurantJWT, updateRestaurantPhoneNo)
router.patch("/update-address", verifyRestaurantJWT, updateRestaurantAddress);

//TODO : upload avatar and cover image.
router.post("/upload-avatar", verifyRestaurantJWT, () => {}); 
router.post("/upload-cover-image", verifyRestaurantJWT, ()=> {});


// TODO: GET PROFILE DETAIL (WITH PRODUCTS, COMMENTS AND RATINGS);



export default router;