import { cartsModel } from "../models/carts.model.js";

export class CartManager {
  async createCart() {
    try {
      const cart = await cartsModel.create({ products: [] });
      return cart;
    } catch (error) {
      return;
    }
  }
  async getCartById(cid) {
    try {
      const cart = await cartsModel.findById(cid);
      return cart;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async addProductToCart(cid, pid) {
    try {
      const cart = await cartsModel.findById(cid);
      const product = cart.products.find((item) => item.productId === pid);
      if (product) {
        product.quantity++;
      } else {
        cart.products.push({
          productId: pid,
          quantity: 1,
        });
      }
      const newCart = await cartsModel.findByIdAndUpdate(cid, cart, {
        new: true,
      });
      return newCart;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
