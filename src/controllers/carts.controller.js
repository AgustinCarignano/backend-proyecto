import cartsService from "../services/carts.service.js";

export class CartsController {
  async createCart(req, res) {
    try {
      const cart = await cartsService.createCart();
      res.status(200).json({
        message: "Nuevo carrito generado con éxito",
        cart,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async getCart(req, res) {
    const { cid } = req.params;
    const cart = await cartsService.getCartById(cid);
    res.status(200).json({
      message: `Productos del carrito con id: ${cid} obtenido con éxito`,
      cart,
    });
  }
  async addProduct(req, res) {
    const { cid, pid } = req.params;
    const cart = await cartsService.addProductToCart(cid, pid);
    res.status(200).json({ message: "Producto agregado con éxito", cart });
  }
  async updateCart(req, res) {
    const { cid } = req.params;
    const products = req.body;
    const cart = await cartsService.updateCart(cid, products);
    res.status(200).json({
      message: "Carrito actualizado",
      cart,
    });
  }
  async updateProduct(req, res) {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await cartsService.updateProductInCart(cid, pid, quantity);
    res.status(200).json({
      message: `El producto con id: ${pid} ha sido actualizado`,
      cart,
    });
  }
  async deleteProduct(req, res) {
    const { cid, pid } = req.params;
    const cart = await cartsService.deleteProduct(cid, pid);
    res.status(200).json({
      message: `Eliminado el producto con el id ${pid} del carrito`,
      cart,
    });
  }
  async cleanCart(req, res) {
    const { cid } = req.paramas;
    const cart = await cartsService.cleanCart(cid);
    res.status(200).json({
      message: `Eliminados todos los productos del carrito con id: ${cid}`,
      cart,
    });
  }
  async checkOut(req, res) {
    const { cid } = req.params;
    const { email } = req.user;
    const cart = await cartsService.getCartById(cid);
    const formatCart = JSON.parse(JSON.stringify(cart));
    const productsInStock = [];
    const productsOutOfStock = [];
    for (let i = 0; i < formatCart.products.length; i++) {
      if (
        formatCart.products[i].product.stock >= formatCart.products[i].quantity
      ) {
        productsInStock.push(formatCart.products[i]);
      } else {
        productsOutOfStock.push(formatCart.products[i].product);
      }
    }
    if (productsInStock.length === 0) {
      return res.json({
        message: "There is not available stock",
        ticket: "",
        productsOutOfStock,
      });
    }
    const ticket = await cartsService.generateTicket(
      productsInStock,
      productsOutOfStock,
      email,
      cid
    );
    if (productsOutOfStock.length !== 0) {
      return res.json({
        message: "There are some products out of stock",
        ticket,
        productsOutOfStock,
      });
    }
    return res.json({
      message: "All products are in stock",
      ticket,
      productsOutOfStock,
    });
  }
}

export default new CartsController();
