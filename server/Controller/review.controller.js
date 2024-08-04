import { Product } from "../Models/product.model.js";
import Review from "../Models/review.model.js";
import { ErrorHandler } from "../Utils/ApiErrorHandler.js";
import { ApiResponseHandler } from "../Utils/ApiResponseHandler.js";
import { asyncHandler } from "../Utils/AsyncHandler.js";


//TODO: Add image to review..
export const addReview = asyncHandler(async(req, res) => {
    const {productId, rating, comment} = req.body; //Also add image to upload on cloudinary
    const customerId = req.user?._id;
    console.log("fahad")
    if(!productId || !rating) {
        throw new ErrorHandler(400, "Please provide product id and rating");
    }

    if(rating < 0 || rating > 5){
        throw new ErrorHandler(400, "Please provide a valid rating");
    }

    const product = await Product.findById(productId);

    if(!product) {
        throw new ErrorHandler(404, "Product not found");
    }

    const newReview = await Review.create({
        product: productId,
        customer: customerId,
        rating,
        comment: comment ? comment : "",
    });

    if(!newReview) {
        throw new ErrorHandler(500, "Cannot add review for the product due to server error");
    }

    return res.status(201)
    .json( new ApiResponseHandler(
        200,
        newReview,
        "Review added successfully"
    ))

    
});

export const updateReview = asyncHandler(async (req, res) => {
    const {rating, comment} = req.body;
    const { reviewId } = req.params;


    if(!rating || !comment) {
        throw new ErrorHandler(400, "Please provide new rating or comment to update your review");
    }

    if(rating < 0 || rating > 5) {
        throw new ErrorHandler(400, "Please provide a valid rating");
    } 

    const updatedReview = await Review.findByIdAndUpdate(
        reviewId,
        {
            $set: {
                rating: rating,
                comment: comment,
            }
        },
        {
            new: true,
        }
    )

    if(!updatedReview) {
        throw new ErrorHandler(404, "Review not found");
    }

    return res.status(200).
        json( new ApiResponseHandler(
            200,
            updatedReview,
            "Review updated successfully"
        ));

});

export const deleteReviewByCustomer = asyncHandler(async(req, res) => {
    const { reviewId } = req.params;

    const reviewFound = await Review.findById(reviewId);

    if(!reviewFound) {
        throw new ErrorHandler(404, "Review not found");
    }

    if(reviewFound.customer.toString() !== req.user?._id.toString()) {
        throw new ErrorHandler(401, "Unauthorized request");
    }

    await Review.deleteOne({_id: reviewId});

    return res.status(200).
        json( new ApiResponseHandler(
            200,
            {},
            "Review deleted successfully",
        ))
});

export const getAllRestaurantReviews = asyncHandler(async (req, res) => {
    const restaurantId = req.user?._id; // Assuming req.user contains authenticated user info

    const reviews = await Review.aggregate([
      {
        $lookup: {
          from: "products", // Collection name in MongoDB
          localField: "product",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      {
        $unwind: "$productDetails"
      },
      {
        $match: {
          "productDetails.owner": restaurantId
        }
      },
      {
        $project: {
          product: 1,
          customer: 1,
          rating: 1,
          comment: 1,
          createdAt: 1,
          updatedAt: 1,
          "productDetails.name": 1,
          "productDetails._id": 1
        }
      }
    ]);
  
    if (reviews.length === 0) {
      return res.status(200).json({
        message: "No reviews found for this restaurant.",
        reviews: [],
      });
    }
  
    return res.status(200)
        .json( new ApiResponseHandler(
            200,
            reviews,
            "Review Retrieved Successfully",
        ) );
});

export const deleteReviewByRestaurant = asyncHandler(async(req, res) => {
    const { reviewId } = req.params;

    const reviewFound = await Review.findById(reviewId);

    if(!reviewFound) {
        throw new ErrorHandler(404, "Review not found");
    }

    await Review.deleteOne({_id: reviewId});

    return res.status(200).
        json( new ApiResponseHandler(
            200,
            {},
            "Review deleted successfully",
        ))
});

export const getAllReviewsOfProduct = asyncHandler(async(req, res) => {
    const { productId } = req.params;

    const reviews = await Review.find({product: productId});

    if(reviews.length === 0) {
        throw new ErrorHandler(404, "No reviews found for this product");
    }

    return res.status(200).
        json( new ApiResponseHandler(
            200,
            reviews,
            "Reviews retrieved successfully"
        ))

})