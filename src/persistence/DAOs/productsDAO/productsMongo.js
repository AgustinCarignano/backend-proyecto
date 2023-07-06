import { productsModel } from "../../MongoDB/models/products.model.js";

class ProductsMongo {
  async getProducts(params) {
    if (!params) {
      const allProducts = await productsModel.find().lean();
      return allProducts;
    }
    let query = {};
    if (params.query) {
      const i = params.query.indexOf(":");
      const f = params.query.length;
      const key = params.query.slice(0, i);
      const value = params.query.slice(i + 1, f);
      query[key] = value;
      delete params.query;
    }
    if (params.sort) {
      params.sort = params.sort === "asc" ? { price: 1 } : { price: -1 };
    }
    try {
      const products = await productsModel.paginate(query, {
        ...params,
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
  async changeOwner(email) {
    const products = await productsModel.find({ owner: email }).lean();
    if (products.length === 0) return;
    for (let i = 0; i < products.length; i++) {
      await productsModel.findByIdAndUpdate(products[i]._id, {
        owner: "admin",
      });
    }
    return;
  }
}

export default new ProductsMongo();
