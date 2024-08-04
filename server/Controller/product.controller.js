import { Product } from "../Models/product.model.js";
import { ErrorHandler } from "../Utils/ApiErrorHandler.js";
import { ApiResponseHandler } from "../Utils/ApiResponseHandler.js";
import { asyncHandler } from "../Utils/AsyncHandler.js";

//TODO: All recieve images in this route and upload to cloudinary.
export const addProduct = asyncHandler(async (req, res) => {
    const { name, description, price, discount, category } = req.body; //images also but for later.
    if (!name || !category || !price) {
        throw new ErrorHandler(400, "Please provide name, price and category of the product");
    }

    if (price < 0) {
        throw new ErrorHandler(400, "Please provide a valid price of product");
    }
    
    if (discount !== undefined && discount !== "") {
        const discountValue = parseInt(discount);
        if (isNaN(discountValue) || discountValue <= 0 || discountValue >= 100) {
            throw new ErrorHandler(400, "Please provide a valid discount percentage");
        }
    }

    if (!req.user._id) {
        throw new ErrorHandler(404, "Unauthorized Request");
    }

    const newProduct = await Product.create({
        name,
        owner: req.user._id,
        description,
        price,
        discount,
        category,
    })

    return res.status(201).
        json(
            new ApiResponseHandler(
                200,
                newProduct,
                "Product has been created successfully",
            )
        )

});

export const deleteProduct = asyncHandler(async (req, res) => {
    const {productId} = req.params;
    if(!productId){
        throw new ErrorHandler(400, "Product id not provided");
    }

    const product = await Product.findById(productId);
    
    if(!product) {
        throw new ErrorHandler(404, "Product not found");
    }

    if(product.owner.toString() !== req.user?._id.toString()) {
        throw new ErrorHandler(401, "Unauthorized Request");
    }

    const deleteSuccessful = await Product.deleteOne({_id: productId});

    if(!deleteSuccessful) {
        throw new ErrorHandler(500, "Product cannot be deleted due to server error");
    }

    return res.status(200).
        json(new ApiResponseHandler(
            200,
            {},
            "Product deleted Successfully"
        ))

});

export const updateProductDetails = asyncHandler(async (req, res) => {
    const {name, description, price, discount, category} = req.body;
    const {productId} = req.params;

    if(!productId) {
        throw new ErrorHandler(400, "Product id not provided");
    }

    if(!name || !description || !price || !discount || !category) {
        throw new ErrorHandler(400, "Please provide all the product details");
    }

    if (price < 0) {
        throw new ErrorHandler(400, "Please provide a valid price of product");
    }

    if (discount !== undefined && discount !== "") {
        const discountValue = parseInt(discount);
        if (isNaN(discountValue) || discountValue <= 0 || discountValue >= 100) {
            throw new ErrorHandler(400, "Please provide a valid discount percentage");
        }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
            $set: {
                name: name,
                description: description,
                price: price,
                discount: discount,
                category: category
            }
        },
        {
            new: true,
        }
    );

    if(!updatedProduct) {
        throw new ErrorHandler(404, "Product not found")
    }

    return res.status(200).
        json( new ApiResponseHandler(
            200,
            updatedProduct,
            "Product updated successfully"
        ))
});

export const getProductById = asyncHandler(async (req, res) => {
    const {productId} = req.params;

    const product = await Product.findById(productId);
    
    if(!product) {
        throw new ErrorHandler(404, "Product not found");
    }
    return res.status(200).
        json( new ApiResponseHandler(
            200,
            product,
        ))
});

export const getAllProducts = asyncHandler(async (req, res) => {
    // Extract pagination parameters from the query string
    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 10;

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Extract the search query from the query string
    const searchQuery = req.query?.search || '';

    // Define the filter for the search
    const filter = searchQuery
        ? { name: { $regex: searchQuery, $options: 'i' } } // Case-insensitive search
        : {};

    // Fetch the products with pagination and search filter
    const products = await Product.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    // Get the total number of products matching the search criteria for pagination metadata
    const totalProducts = await Product.countDocuments(filter);

    // Send the response
    return res.status(200).json(
        new ApiResponseHandler(200, {
            products,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page,
        })
    );
});

export const getAllProductsOfRestaurant = asyncHandler(async (req, res) => {
    const { restaurantId } = req.params;

    if (!restaurantId) {
        throw new ErrorHandler(400, "Restaurant id not provided");
    }

    // Extract pagination parameters from the query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Extract the search query from the query string
    const searchQuery = req.query.search || '';

    // Define the filter for the search and restaurant
    const filter = {
        owner: restaurantId,
        ...(searchQuery && { name: { $regex: searchQuery, $options: 'i' } }) // Add search filter if searchQuery is provided
    };

    try {
        // Fetch the products with pagination, restaurant filter, and optional search filter
        const products = await Product.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        // Get the total number of products matching the restaurant and search criteria for pagination metadata
        const totalProducts = await Product.countDocuments(filter);

        // Send the response
        return res.status(200).json(
            new ApiResponseHandler(200, {
                products,
                totalProducts,
                totalPages: Math.ceil(totalProducts / limit),
                currentPage: page,
            })
        );
    } catch (error) {
        throw new ErrorHandler(500, "An error occurred while fetching products");
    }
});


export const updateProductStatus = asyncHandler(async(req, res) => {
    const {productStatus} = req.body;
    const {productId} = req.params;

    if(!productStatus) {
        throw new ErrorHandler(400, "Please provide the product status");
    }

    if(!productId) {
        throw new ErrorHandler(400, "Product id not provided");
    }

    const validStatuses = ["AVAILABLE", "DISCONTINUED", "OUT_OF_STOCK"];
    if (!validStatuses.includes(productStatus)) {
        throw new ErrorHandler(400, "Invalid product status provided");
    }

    const product = await Product.findByIdAndUpdate(
        productId,
        {
            $set: {
                status: productStatus
            }
        },
        { new: true, runValidators: true}
    );

    if(!product) {
        throw new ErrorHandler(404, "Product not found");
    }

    return res.status(200).
        json( new ApiResponseHandler(
            200,
            product,
            "Product status updated successfully"
        ))

})