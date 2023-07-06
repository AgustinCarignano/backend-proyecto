import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
    default: "",
  },
  age: {
    type: Number,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
  },
  documents: {
    type: [
      {
        name: {
          type: String,
          required: true,
        },
        reference: {
          type: String,
          required: true,
        },
      },
    ],
  },
  last_connection: {
    type: Date,
    default: Date.now,
  },
});

export const usersModel = mongoose.model("Users", usersSchema);
