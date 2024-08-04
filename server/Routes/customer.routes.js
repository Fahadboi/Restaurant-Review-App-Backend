import express from "express";
import { verifyCustomerJWT } from "../Middlewares/auth.middleware.js";
import { updateCustomerEmail, updateCustomerName } from "../Controller/customer.controller.js";

const router = express.Router();


router.patch("/update-customer-email", verifyCustomerJWT, updateCustomerEmail);
router.patch("/update-name", verifyCustomerJWT, updateCustomerName);
router.patch("/upload-avatar", verifyCustomerJWT, () => {}) //TODO: ADD UpdateAvatar Controller here...

export default router;