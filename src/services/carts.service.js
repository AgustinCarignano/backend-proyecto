import cartsDAO from "../persistence/DAOs/cartsDAO/cartsMongo.js";
import productsDAO from "../persistence/DAOs/productsDAO/productsMongo.js";
import ticketsDAO from "../persistence/DAOs/ticketsDAO/ticketsMongo.js";

class CartsService {
  async createCart() {
    try {
      const cart = await cartsDAO.createCart();
      return cart;
    } catch (error) {
      return error;
    }
  }
  async getCartById(cid) {
    try {
      const cart = await cartsDAO.getCartById(cid);
      return cart;
    } catch (error) {
      return error;
    }
  }
  async addProductToCart(cid, pid) {
    try {
      await productsDAO.getProductById(pid);
      const cart = await cartsDAO.addProductToCart(cid, pid);
      return cart;
    } catch (error) {
      return error;
    }
  }
  async updateCart(cid, newProducts) {
    try {
      const cart = await cartsDAO.updateCart(cid, newProducts);
      return cart;
    } catch (error) {
      return error;
    }
  }
  async updateProductInCart(cid, pid, quantity) {
    try {
      const cart = await cartsDAO.updateProductInCart(cid, pid, quantity);
      return cart;
    } catch (error) {
      return error;
    }
  }
  async deleteProduct(cid, pid) {
    try {
      const cart = await cartsDAO.deleteProductById(cid, pid);
      return cart;
    } catch (error) {
      return error;
    }
  }
  async cleanCart(cid) {
    try {
      const cart = await cartsDAO.deleteProducts(cid);
      return cart;
    } catch (error) {
      return error;
    }
  }
  async generateTicket(productsInStock, productsOutOfStock, userEmail, cartId) {
    let totalPrice = 0;
    for (let i = 0; i < productsInStock.length; i++) {
      totalPrice +=
        productsInStock[i].product.price * productsInStock[i].quantity;
    }
    const code = this.#generateTicketCode();
    const ticket = await ticketsDAO.generateTicket(code, totalPrice, userEmail);
    if (productsOutOfStock.length === 0) await this.cleanCart(cartId);
    productsInStock.forEach(async (prod) => {
      const remainStock = prod.product.stock - prod.quantity;
      await productsDAO.updateProduct(prod.product._id, {
        ...prod.product,
        stock: remainStock,
      });
      await this.deleteProduct(cartId, prod.product._id);
    });
    return ticket;
  }
  #generateTicketCode() {
    let code = "T-";
    while (code.length < 14) {
      code += Math.floor(Math.random() * 9);
    }
    return code;
  }
}

export default new CartsService();
