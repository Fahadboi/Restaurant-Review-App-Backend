import mongoose, { Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const customerSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
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
      unique: true,
      trim: true,
    },

    avatar: {
      type: String,
      default:
        "https://i.pinimg.com/originals/be/61/a4/be61a49e03cb65e9c26d86b15e63e12a.jpg",
    },

    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);


//Hashing the password before saving..
customerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


//Checking password with the hash stored in the db.
customerSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

//Generate access token..
customerSchema.methods.generateAccessToken = function () {
    const access_token = jwt.sign({
        _id: this._id,
        email: this.email,
        avatar: this.avatar,
        phoneNo: this.phoneNo,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });

    return access_token;
}

//Generate Refresh Token..
customerSchema.methods.generateRefreshToken = function () {
    const refresh_token = jwt.sign({
        _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    });

    return refresh_token;
}


export const Customer = mongoose.model("Customer", customerSchema);
