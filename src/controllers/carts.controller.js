import cartsService from "../services/carts.service.js";
import productsService from "../services/products.service.js";
import CustomError from "../utils/errors/customError.utils.js";
import { ErrorEnums } from "../utils/errors/errors.enums.js";
import { logger } from "../utils/winston.js";

export class CartsController {
  async createCart(_req, res, next) {
    try {
      const cart = await cartsService.createCart();
      if (cart instanceof Error) {
        CustomError.generateError(ErrorEnums.SERVER_ERROR);
      }
      res.status(200).json({
        message: "Nuevo carrito generado con éxito",
        cart,
      });
    } catch (error) {
      next(error);
    }
  }
  async getCart(req, res, next) {
    try {
      const { cid } = req.params;
      if (!cid) CustomError.generateError(ErrorEnums.MISSING_VALUES);
      const cart = await cartsService.getCartById(cid);
      if (cart instanceof Error)
        CustomError.generateError(ErrorEnums.SERVER_ERROR);
      res.status(200).json({
        message: `Productos del carrito con id: ${cid} obtenido con éxito`,
        cart,
      });
    } catch (error) {
      next(error);
    }
  }
  async addProduct(req, res, next) {
    try {
      const { cid, pid } = req.params;
      const { email } = req.user;
      if (!cid || !pid)
        return CustomError.generateError(ErrorEnums.MISSING_VALUES);
      const { owner } = await productsService.getProductById(pid);
      if (email === owner) {
        return CustomError.generateError(ErrorEnums.UNAUTHORIZED);
      }
      const cart = await cartsService.addProductToCart(cid, pid);
      if (cart instanceof Error)
        return CustomError.generateError(ErrorEnums.SERVER_ERROR);
      res.status(200).json({ message: "Producto agregado con éxito", cart });
    } catch (error) {
      next(error);
    }
  }
  async updateCart(req, res, next) {
    const { cid } = req.params;
    const { email } = req.user;
    const products = req.body;
    try {
      if (!cid) CustomError.generateError(ErrorEnums.MISSING_VALUES);
      products.forEach((prod) => {
        if (prod.owner === email)
          CustomError.generateError(ErrorEnums.UNAUTHORIZED);
      });
      const cart = await cartsService.updateCart(cid, products);
      if (cart instanceof Error)
        CustomError.generateError(ErrorEnums.MISSING_VALUES);
      res.status(200).json({
        message: "Carrito actualizado",
        cart,
      });
    } catch (error) {
      next(error);
    }
  }
  async updateProduct(req, res, next) {
    const { cid, pid } = req.params;
    const { email } = req.user;
    const { quantity } = req.body;
    try {
      if (!cid || !pid || !quantity)
        CustomError.generateError(ErrorEnums.MISSING_VALUES);
      const { owner } = await productsService.getProductById(pid);
      if (owner === email) CustomError.generateError(ErrorEnums.UNAUTHORIZED);
      const cart = await cartsService.updateProductInCart(cid, pid, quantity);
      if (cart instanceof Error)
        CustomError.generateError(ErrorEnums.NOT_FOUND);
      res.status(200).json({
        message: `El producto con id: ${pid} ha sido actualizado`,
        cart,
      });
    } catch (error) {
      next(error);
    }
  }
  async deleteProduct(req, res, next) {
    const { cid, pid } = req.params;
    try {
      if (!cid || !pid) CustomError.generateError(ErrorEnums.MISSING_VALUES);
      const cart = await cartsService.deleteProduct(cid, pid);
      if (cart instanceof Error)
        CustomError.generateError(ErrorEnums.NOT_FOUND);
      res.status(200).json({
        message: `Eliminado el producto con el id ${pid} del carrito`,
        id: cid,
      });
    } catch (error) {
      next(error);
    }
  }
  async cleanCart(req, res, next) {
    const { cid } = req.params;
    try {
      if (!cid) CustomError.generateError(ErrorEnums.MISSING_VALUES);
      const cart = await cartsService.cleanCart(cid);
      if (cart instanceof Error)
        CustomError.generateError(ErrorEnums.NOT_FOUND);
      res.status(200).json({
        message: `Eliminados todos los productos del carrito con id: ${cid}`,
        cart,
      });
    } catch (error) {
      next(error);
    }
  }
  async checkOut(req, res, next) {
    const { cid } = req.params;
    const { email } = req.user;
    try {
      if (!cid) CustomError.generateError(ErrorEnums.MISSING_VALUES);
      const cart = await cartsService.getCartById(cid);
      if (cart instanceof Error)
        CustomError.generateError(ErrorEnums.NOT_FOUND);
      const formatCart = JSON.parse(JSON.stringify(cart));
      const productsInStock = [];
      const productsOutOfStock = [];
      for (let i = 0; i < formatCart.products.length; i++) {
        if (
          formatCart.products[i].product.stock >=
          formatCart.products[i].quantity
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
      if (ticket instanceof Error)
        CustomError.generateError(ErrorEnums.SERVER_ERROR);
      logger.info("A purchase was made successfully");
      if (productsOutOfStock.length !== 0) {
        logger.info("There is not enough stock for some products");
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
    } catch (error) {
      next(error);
    }
  }
}

export default new CartsController();
