import { Restaurant } from "../Models/restaurant.model.js";
import { ErrorHandler } from "../Utils/ApiErrorHandler.js";
import { ApiResponseHandler } from "../Utils/ApiResponseHandler.js";
import { asyncHandler } from "../Utils/AsyncHandler.js";


export const updateRestaurantName = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if (!name) {
        throw new ErrorHandler(400, "Please provide your new restaurant name");
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                name: name
            }
        },
        {
            new: true,
        }
    ).select("name");

    if (!restaurant) {
        throw new ErrorHandler(500, "Cannot change the name due to some reason");
    }

    return res.status(200).json(
        new ApiResponseHandler(
            200,
            { name: restaurant.name },
            "Restaurant name updated successfully"
        )
    )
});

export const updateRestaurantEmail = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ErrorHandler(400, "Please provide your new email");
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                email: email
            }
        },
        {
            new: true,
        }
    ).select("email");

    if (!restaurant) {
        throw new ErrorHandler(500, "Cannot change the email due to some reason");
    }

    return res.status(200).json(
        new ApiResponseHandler(
            200,
            { email: restaurant.email },
            "Email updated successfully"
        )
    )
});

export const updateRestaurantPhoneNo = asyncHandler(async (req, res) => {
    const { phoneNo } = req.body;

    if (!phoneNo) {
        throw new ErrorHandler(400, "Please provide your new phone no");
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                phoneNo: phoneNo
            }
        },
        {
            new: true,
        }
    ).select("phoneNo");

    if (!restaurant) {
        throw new ErrorHandler(500, "Cannot change the phone No due to some reason");
    }

    return res.status(200).json(
        new ApiResponseHandler(
            200,
            { phoneNo: restaurant.phoneNo },
            "Phone No updated successfully"
        )
    )
});


export const updateRestaurantAddress = asyncHandler(async (req, res) => {
    const { city, location } = req.body;

    if (!city) {
        throw new ErrorHandler(400, "Please provide the city name of your restaurant");
    }

    if (!location?.address) {
        throw new ErrorHandler(
            400,
            "Please provide the new address of your restaurant"
        );
    }

    if (location.coordinates?.coordinates.length <= 0) {
        throw new ErrorHandler(
            400,
            "Please provide the coordinates of your restaurant"
        );
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                city: city,
                location: location,
            }
        },
        {
            new: true,
        }
    ).select("city location");

    if (!restaurant) {
        throw new ErrorHandler(500, "Cannot change the address due to some reason");
    }

    return res.status(200).json(
        new ApiResponseHandler(
            200,
            { name: restaurant.name },
            "Restaurant address updated successfully"
        )
    )
});

