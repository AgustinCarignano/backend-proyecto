import mongoose from "mongoose";

const cartsSchema = mongoose.Schema({
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

export const cartsModel = mongoose.model("Carts", cartsSchema);
