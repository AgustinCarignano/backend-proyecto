import { cartsModel } from "../../MongoDB/models/carts.model.js";

class CartsMongo {
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
      const cart = await cartsModel.findById(cid).populate({
        path: "products",
        populate: { path: "product", model: "Products" },
      });
      return cart;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async addProductToCart(cid, pid) {
    try {
      const cart = await cartsModel.findById(cid);
      const product = cart.products.find(
        (item) => item.product.toString() === pid
      );
      if (product) {
        product.quantity++;
      } else {
        cart.products.push({
          product: pid,
          quantity: 1,
        });
      }
      cart.save();
      return cart;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async updateCart(cid, newProducts) {
    const cart = await cartsModel.findByIdAndUpdate(
      cid,
      { products: newProducts },
      { new: true }
    );
    return cart;
  }
  async updateProductInCart(cid, pid, q) {
    const cart = await cartsModel.findById(cid);
    const product = cart.products.find(
      (item) => item.product.toString() === pid
    );
    product.quantity = q;
    cart.save();
    return cart;
  }
  async deleteProductById(cid, pid) {
    const cart = await cartsModel.findById(cid);
    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === pid
    );
    cart.products.splice(productIndex, 1);
    cart.save();
    return cart;
  }
  async deleteProducts(cid) {
    const cart = await cartsModel.findById(cid);
    cart.products.splice(0, cart.products.length);
    cart.save();
    return cart;
  }
  async deleteProductsByProductId(pid) {
    const carts = await cartsModel.find({
      "products.product": pid,
    });
    for (let i = 0; i < carts.length; i++) {
      const index = carts[i].products.findIndex(
        (item) => item.product.toString() === pid
      );
      carts[i].products.splice(index, 1);
      carts[i].save();
    }
  }
  async deleteCarts(cartIds) {
    const resp = await cartsModel.deleteMany({ _id: cartIds });
    return resp;
  }
}

export default new CartsMongo();
