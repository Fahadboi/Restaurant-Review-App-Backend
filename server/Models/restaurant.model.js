import mongoose, { Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Resturant Profile Schema:
const restaurantSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },

    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is Required"],
    },

    phoneNo: {
      type: String,
      trim: true,
      required: true,
    },

    avatar: {
      type: String,
      default:
        "https://i.pinimg.com/originals/be/61/a4/be61a49e03cb65e9c26d86b15e63e12a.jpg",
    },

    coverImage: {
      type: String,
      default:
        "https://www.creativefabrica.com/wp-content/uploads/2022/01/11/Facebook-cover-design-for-restaurant-Graphics-23306206-1-580x386.jpg",
    },

    location: {
      address: {
        type: String,
        required: true,
        trim: true,
      },
      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
        },
      },
    },

    city: {
        type: String,
        required: true,
        trim: true,
    },

    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

//Hashing the password before saving..
restaurantSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//Checking password with the hash stored in the db.
restaurantSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//Generate access token..
restaurantSchema.methods.generateAccessToken = function () {
  const access_token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      avatar: this.avatar,
      phoneNo: this.phoneNo,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );

  return access_token;
};

//Generate Refresh Token..
restaurantSchema.methods.generateRefreshToken = function () {
  const refresh_token = jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );

  return refresh_token;
};

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);
