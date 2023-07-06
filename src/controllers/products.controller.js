import cartsService from "../services/carts.service.js";
import productsService from "../services/products.service.js";
import CustomError from "../utils/errors/customError.utils.js";
import { ErrorEnums } from "../utils/errors/errors.enums.js";
import { transporter } from "../utils/nodemailer.utils.js";

class ProductsController {
  async getProducts(req, res) {
    const { limit = 10, page = 1, sort, query } = req.query;
    try {
      const products = await productsService.getProducts({
        limit,
        page,
        sort,
        query,
      });
      let prevUrl = null;
      let nextUrl = null;
      if (products.hasPrevPage) {
        const i = req.originalUrl.indexOf("page=");
        if (i === -1) {
          prevUrl = `${req.originalUrl}?page=${products.prevPage}`;
        } else {
          prevUrl = `${req.originalUrl.substring(0, i)}page=${
            products.prevPage
          }${req.originalUrl.substring(i + 6, req.originalUrl.length)}`;
        }
      }
      if (products.hasNextPage) {
        const i = req.originalUrl.indexOf("page=");
        if (i === -1) {
          nextUrl = `${req.originalUrl}?page=${products.nextPage}`;
        } else {
          nextUrl = `${req.originalUrl.slice(0, i)}page=${
            products.nextPage
          }${req.originalUrl.slice(i + 6, req.originalUrl.length)}`;
        }
      }

      //Estructura de la respuesta
      res.json({
        status: "success",
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: prevUrl,
        nextLink: nextUrl,
      });
    } catch (error) {
      res.status(404).json({ status: "error", error: error.message });
    }
  }
  async getProductById(req, res, next) {
    const { pid } = req.params;
    try {
      const product = await productsService.getProductById(pid);
      if (product instanceof Error) {
        CustomError.generateError(ErrorEnums.NOT_FOUND);
      }
      res.json({ status: "success", product });
    } catch (error) {
      next(error);
    }
  }
  async addProduct(req, res, next) {
    const newProduct = req.body;
    const { email } = req.user;
    try {
      const product = await productsService.addProduct({
        ...newProduct,
        owner: email,
      });
      if (product instanceof Error) {
        CustomError.generateError(ErrorEnums.MISSING_VALUES);
      }
      res.status(200).json({
        message: "Producto cargado con éxito",
        product,
      });
    } catch (error) {
      next(error);
    }
  }
  async updateProduct(req, res, next) {
    try {
      const { pid } = req.params;
      const { email } = req.user;
      const { isAdmin } = req.session;
      const newProduct = req.body;
      const product = await productsService.getProductById(pid);
      if (!isAdmin && email !== product.owner)
        CustomError.generateError(ErrorEnums.UNAUTHORIZED);
      const updatedProduct = await productsService.updateProduct(pid, {
        ...product,
        ...newProduct,
      });
      if (product instanceof Error) {
        CustomError.generateError(ErrorEnums.MISSING_VALUES);
      }
      res.status(200).json({
        message: "Producto modificado con éxito",
        updatedProduct,
      });
    } catch (error) {
      next(error);
    }
  }
  async deleteProduct(req, res) {
    const { pid } = req.params;
    const product = await productsService.deleteProduct(pid);
    await cartsService.deleteProducts(pid);
    if (product instanceof Error) {
      CustomError.generateError(ErrorEnums.MISSING_VALUES);
    }
    const mailContent = {
      from: "CoderBackend",
      subject: "Producto eliminado",
      to: product.owner,
      html: `<p>Se ha eliminado el producto ${product.title} con el codigo ${product.code}</p>`,
    };
    await transporter.sendMail(mailContent);
    res
      .status(200)
      .json({ message: "producto eliminado con éxito", id: product.id });
  }
}

export default new ProductsController();
