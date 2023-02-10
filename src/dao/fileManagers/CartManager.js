import fs from "fs";
import { __dirname } from "../../utils.js";

const path = `${__dirname}/files/carritos.json`;

export class CartManager {
  async createCart() {
    try {
      const carts = await this.#getAllCarts();
      const cart = {
        id: await this.#generateId(),
        products: [],
      };
      carts.push(cart);
      await this.#writeFile(carts);
      return cart;
    } catch (error) {
      return error;
    }
  }
  async getCartById(cid) {
    try {
      const carts = await this.#getAllCarts();
      const cart = carts.find((cart) => cart.id === parseInt(cid));
      return cart
        ? cart.products
        : this.#generateError("Not found: No existe un carrito con ese id");
    } catch (error) {
      return error;
    }
  }
  async addProductToCart(cid, pid) {
    const prodId = pid.length > 5 ? pid : parseInt(pid);
    try {
      const carts = await this.#getAllCarts();
      const cart = carts.find((cart) => cart.id === parseInt(cid));
      !cart && this.#generateError("No existe un carrito con el id indicado");
      const productIsInCart = cart.products.find(
        (prod) => prod.product === prodId
      );
      if (productIsInCart) {
        productIsInCart.quantity++;
      } else {
        cart.products.push({ product: prodId, quantity: 1 });
      }
      await this.#writeFile(carts);
      return cart;
    } catch (error) {
      return error;
    }
  }
  async #getAllCarts() {
    if (fs.existsSync(path)) {
      const carts = await fs.promises.readFile(path, "utf-8");
      return JSON.parse(carts);
    } else {
      return [];
    }
  }
  async #writeFile(file) {
    await fs.promises.writeFile(path, JSON.stringify(file));
  }
  async #generateId() {
    const carts = await this.#getAllCarts();
    const id = carts.length === 0 ? 1 : carts[carts.length - 1].id + 1;
    return id;
  }
  #generateError(messagge) {
    throw new Error(messagge);
  }
}
