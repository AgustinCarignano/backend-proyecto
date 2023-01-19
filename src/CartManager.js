import fs from "fs";

export class CartManager {
  constructor(path) {
    this.path = path;
  }
  async createCart() {
    const carts = await this.#getAllCarts();
    const cart = {
      id: await this.#generateId(),
      products: [],
    };
    carts.push(cart);
    await this.#writeFile(carts);
    return cart;
  }
  async getCartById(cid) {
    const carts = await this.#getAllCarts();
    const cart = carts.find((cart) => cart.id === cid);
    return cart
      ? cart.products
      : this.#generateError("Not found: No existe un carrito con ese id");
  }
  async addProductToCart(cid, pid) {
    const carts = await this.#getAllCarts();
    const cart = carts.find((cart) => cart.id === cid);
    !cart && this.#generateError("No existe un carrito con el id indicado");
    const productIsInCart = cart.products.find((prod) => prod.product === pid);
    if (productIsInCart) {
      productIsInCart.quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }
    await this.#writeFile(carts);
    return cart;
  }
  async #getAllCarts() {
    if (fs.existsSync(this.path)) {
      const carts = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(carts);
    } else {
      return [];
    }
  }
  async #writeFile(file) {
    await fs.promises.writeFile(this.path, JSON.stringify(file));
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
