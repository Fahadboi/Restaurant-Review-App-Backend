import { Customer } from "../Models/customer.model.js";
import { ErrorHandler } from "../Utils/ApiErrorHandler.js";
import { ApiResponseHandler } from "../Utils/ApiResponseHandler.js";
import { asyncHandler } from "../Utils/AsyncHandler.js";


export const updateCustomerEmail = asyncHandler(async(req, res) => {
    const {email} = req.body;

    if(!email) {
        throw new ErrorHandler(400, "Please provide your new email");
    }

    const customer = await Customer.findByIdAndUpdate(
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

    if(!customer) {
        throw new ErrorHandler(500, "Cannot change the email due to some reason");
    }

    return res.status(200).json(
        new ApiResponseHandler(
            200,
            { email: customer.email },
            "Email updated successfully"
        )
    )

});


export const updateCustomerName = asyncHandler(async(req, res) => {
    const {name} = req.body;

    if(!name) {
        throw new ErrorHandler(400, "Please provide your new name");
    }

    const customer = await Customer.findByIdAndUpdate(
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

    if(!customer) {
        throw new ErrorHandler(500, "Cannot change the name due to some reason");
    }

    return res.status(200).json(
        new ApiResponseHandler(
            200,
            { name: customer.name },
            "Name updated successfully"
        )
    )
});

