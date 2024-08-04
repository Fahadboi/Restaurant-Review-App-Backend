import { Customer } from "../Models/customer.model.js";
import { Restaurant } from "../Models/restaurant.model.js";
import { ErrorHandler } from "./ApiErrorHandler.js";


export const generateAccessAndRefreshToken = async (id, userType) => {
    try {
        let user;
        if (userType === 'customer') {
            user = await Customer.findById(id);
        }
        else if (userType === 'restaurant') {
            user = await Restaurant.findById(id);
        }

        if (!user) {
            console.log(err);
            throw new ErrorHandler(500, `user not found with id : ${id}`);
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })


        return { accessToken, refreshToken };

    } catch (err) {
        console.log(err)
        throw new ErrorHandler(500, "Something went wrong while generating refresh and access token");
    }

}