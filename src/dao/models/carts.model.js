import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },

        quantity: {
          type: Number,
        },
      },
    ],
    default: [],
  },
});

export const cartsModel = mongoose.model("cart", cartSchema);
