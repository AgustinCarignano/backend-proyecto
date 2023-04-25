import { productsModel } from "../../MongoDB/models/products.model.js";

class ProductsMongo {
  async getProducts(searchTerms) {
    /* let query = {};
    if (param.query) {
      const i = param.query.indexOf(":");
      const f = param.query.length;
      const key = param.query.substring(0, i);
      const value = param.query.substring(i + 1, f);
      query[key] = value;
      delete param.query;
    }
    if (param.sort) {
      param.sort = param.sort === "asc" ? { price: 1 } : { price: -1 };
    } */
    try {
      const { param, query } = searchTerms;
      const products = await productsModel.paginate(query, {
        ...param,
        lean: true,
      });
      return products;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getProductById(pid) {
    try {
      const product = await productsModel.findById(pid).lean();
      if (!product)
        throw new Error("No se ha encontrado un producto con el id indicado");
      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async addProduct(newProduct) {
    try {
      const product = await productsModel.create(newProduct);
      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async updateProduct(pid, objProduct) {
    try {
      const product = await productsModel.findByIdAndUpdate(pid, objProduct, {
        new: true,
      });
      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async deleteProduct(pid) {
    try {
      const product = await productsModel.findByIdAndDelete(pid);
      return product.id;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default new ProductsMongo();
