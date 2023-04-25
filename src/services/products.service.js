import productsDAO from "../persistence/DAOs/productsDAO/productsMongo.js";

class ProductsService {
  async getProducts(param) {
    let query = {};
    if (param.query) {
      const i = param.query.indexOf(":");
      const f = param.query.length;
      const key = param.query.slice(0, i);
      const value = param.query.slice(i + 1, f);
      query[key] = value;
      delete param.query;
    }
    if (param.sort) {
      param.sort = param.sort === "asc" ? { price: 1 } : { price: -1 };
    }
    try {
      const product = await productsDAO.getProducts({ param, query });
      return product;
    } catch (error) {
      return error;
    }
  }
  async getProductById(pid) {
    try {
      const product = await productsDAO.getProductById(pid);
      return product;
    } catch (error) {
      return error;
    }
  }
  async addProduct(product) {
    try {
      const newProduct = await productsDAO.addProduct(product);
      return newProduct;
    } catch (error) {
      return error;
    }
  }
  async updateProduct(pid, product) {
    try {
      const updatedProduct = await productsDAO.updateProduct(pid, product);
      return updatedProduct;
    } catch (error) {
      return error;
    }
  }
  async deleteProduct(pid) {
    try {
      const id = await productsDAO.deleteProduct(pid);
      return id;
    } catch (error) {
      return error;
    }
  }
}

export default new ProductsService();
