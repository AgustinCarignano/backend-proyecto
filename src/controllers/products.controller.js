import productsService from "../services/products.service.js";

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
  async getProductById(req, res) {
    const { pid } = req.params;
    try {
      const product = await productsService.getProductById(pid);
      res.json({ status: "success", product });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
  async addProduct(req, res) {
    const newProduct = req.body;
    try {
      const product = await productsService.addProduct(newProduct);
      res.status(200).json({
        message: "Producto cargado con éxito",
        product,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async updateProduct(req, res) {
    const { pid } = req.params;
    const product = req.body;
    try {
      const newProduct = await productsService.updateProduct(pid, product);
      res.status(200).json({
        message: "Producto modificado con éxito",
        newProduct,
      });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
  async deleteProduct(req, res) {
    try {
      const { pid } = req.params;
      const id = await productsService.deleteProduct(pid);
      res.status(200).json({ message: "producto eliminado con éxito", id });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

export default new ProductsController();
