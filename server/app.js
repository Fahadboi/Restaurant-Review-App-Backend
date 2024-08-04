import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();


// TODO: Add the frontend url here...
app.use(cors({
    origin: "*"
}));
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit : "16kb" }));
app.use(cookieParser());



//Import routes:
import authRouter from "./Routes/auth.routes.js";
import customerRouter from "./Routes/customer.routes.js"
import restaurantRouter from "./Routes/restaurant.routes.js";
import productRouter from "./Routes/product.routes.js";
import reviewRouter from "./Routes/review.routes.js";

//Customer and Resturant auth endpoint:
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/customer", customerRouter);
app.use("/api/v1/restaurant", restaurantRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/review", reviewRouter);




export default app;