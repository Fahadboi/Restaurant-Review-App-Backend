import { cookieOption } from "../Constants/auth.constants.js";
import { Customer } from "../Models/customer.model.js";
import { Restaurant } from "../Models/restaurant.model.js";
import { ErrorHandler } from "../Utils/ApiErrorHandler.js";
import { asyncHandler } from "../Utils/AsyncHandler.js";
import { ApiResponseHandler } from "../Utils/ApiResponseHandler.js";
import { generateAccessAndRefreshToken } from "../Utils/GenerateTokens.js";
import jwt from "jsonwebtoken";

//--- Customer auth ---

//Register Customer
export const registerCustomer = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new ErrorHandler(
            400,
            "Please provide all the information to register"
        );
    }

    const existedCustomer = await Customer.findOne({ email });
    if (existedCustomer) {
        throw new ErrorHandler(409, "Email is already in use.");
    }

    const newCustomer = await Customer.create({
        name,
        email,
        password,
    });

    if (!newCustomer) {
        throw new ErrorHandler(
            500,
            "Something went wrong while registering the user"
        );
    }

    return res
        .status(201)
        .json(new ApiResponseHandler(200, null, "User registered successfully."));
});


//Login Customer
export const loginCustomer = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ErrorHandler(
            400,
            "Email and password are required. Please provide both."
        );
    }

    const customer = await Customer.findOne({ email: email.toLowerCase() });

    if (!customer) {
        throw new ErrorHandler(404, "User does not exist");
    }

    const isPasswordValid = await customer.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ErrorHandler(400, "Incorrect email or password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        customer._id,
        "customer"
    );

    const loggedInUser = await Customer.findById(customer._id).select(
        "-password -refreshToken"
    );

    return res
        .status(201)
        .cookie("accessToken", accessToken, cookieOption)
        .cookie("refreshToken", refreshToken, cookieOption)
        .json(
            new ApiResponseHandler(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                    userType: "customer",
                },
                "User logged In Successfully"
            )
        );
});


//Logout Customer
export const logoutCustomer = asyncHandler(async (req, res) => {
    await Customer.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1, // this removes the field from document
            },
        },
        {
            new: true,
        }
    );

    res
        .status(200)
        .clearCookie("accessToken", cookieOption)
        .clearCookie("refreshToken", cookieOption)
        .json(new ApiResponseHandler(200, {}, "User logged out successfully."));
});





//--- Restaurant auth ---

//Register Restaurant
export const registerRestaurant = asyncHandler(async (req, res) => {
    const { name, email, password, phoneNo, location, city } = req.body;

    if (!name || !email || !password || !phoneNo || !city) {
        throw new ErrorHandler(
            400,
            "Please provide all the information to register your restaurant"
        );
    }

    if (!location?.address) {
        throw new ErrorHandler(
            400,
            "Please provide the address of your restaurant"
        );
    }

    if (location.coordinates?.coordinates.length <= 0) {
        throw new ErrorHandler(
            400,
            "Please provide the coordinates of your restaurant"
        );
    }

    const existedRestaurant = await Restaurant.findOne({ email });
    if (existedRestaurant) {
        throw new ErrorHandler(409, "Email is already in use.");
    }

    const newRestaurant = await Restaurant.create({
        name,
        email,
        password,
        phoneNo,
        location,
        city,
    });

    if (!newRestaurant) {
        throw new ErrorHandler(
            500,
            "Something went wrong while registering the user"
        );
    }

    return res
        .status(201)
        .json(
            new ApiResponseHandler(200, {}, "Restaurant registered successfully.")
        );
});

//Login Restaurant:
export const loginRestaurant = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ErrorHandler(
            400,
            "Email and password are required. Please provide both."
        );
    }

    const restaurant = await Restaurant.findOne({ email: email.toLowerCase() });

    if (!restaurant) {
        throw new ErrorHandler(404, "User does not exist");
    }

    const isPasswordValid = await restaurant.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ErrorHandler(400, "Incorrect email or password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        restaurant._id,
        "restaurant"
    );
    const loggedInUser = await Restaurant.findById(restaurant._id).select(
        "-password -refreshToken"
    );

    return res
        .status(201)
        .cookie("accessToken", accessToken, cookieOption)
        .cookie("refreshToken", refreshToken, cookieOption)
        .json(
            new ApiResponseHandler(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                    userType: "restaurant",
                },
                "User logged In Successfully"
            )
        );
});

export const logoutRestaurant = asyncHandler(async (req, res) => {
    await Restaurant.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1, // this removes the field from document
            },
        },
        {
            new: true,
        }
    );

    res
        .status(200)
        .clearCookie("accessToken", cookieOption)
        .clearCookie("refreshToken", cookieOption)
        .json(new ApiResponseHandler(200, {}, "User logged out successfully."));
});




//Refresh Token Controller ( Customer & Restaurant):

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies?.refreshToken || req.body?.refreshToken;
    const userType = req.body.userType;
    if (!incomingRefreshToken) {
        throw new ErrorHandler(401, "Unauthorized Request");
    }
    try {

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
        let user;

        if (userType === "customer") {
            user = await Customer.findById(decodedToken._id);
        } else if (userType === "restaurant") {
            user = await Restaurant.findById(decodedToken._id);
        } else {
            throw new ErrorHandler(401, "Unauthorized Request");
        }

        if (!user) {
            throw new Error(401, "Invalid Token Provided - Please login again");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ErrorHandler(401, "Refresh Token is Expired or used"); //Well , it is used at this point.
        }

        const accessToken = await user.generateAccessToken();

        return res
            .status(200)
            .cookie("accessToken", accessToken, cookieOption)
            .json(
                new ApiResponseHandler(
                    200,
                    {
                        accessToken,
                        refreshToken: user.refreshToken,
                    },
                    "Access Token Refreshed"
                )
            );
    } catch (err) {
        throw new ErrorHandler(401, err?.message || "Cannot refresh access Token")
    }
});


export const changePassword = asyncHandler(async (req, res) => {

    const user = req.user;
    const {userType, oldPassword, newPassword} = req.body;
    let foundUser;

    if(!oldPassword || !newPassword) {
        throw new ErrorHandler(400, "Please provide old and new passwords");
    }

    if(userType === 'customer') {
        foundUser = await Customer.findById(user._id);
    } else if(userType === 'restaurant') {
        foundUser = await Restaurant.findById(user._id);
    } else {
        throw new ErrorHandler(401, "Unauthorized request");
    }

    if(!foundUser) {
        throw new ErrorHandler(401, "Unauthorized request");
    }

    const isPasswordValid = await foundUser.isPasswordCorrect(oldPassword);
    
    if(!isPasswordValid) { 
        throw new ErrorHandler(400, "Invalid old password");
    }

    foundUser.password = newPassword;
    await foundUser.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponseHandler(200, {}, "Password changed successfully"))

})
