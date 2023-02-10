import { productsModel } from "../models/products.model.js";

export class ProductManager {
  async getProducts(limit) {
    try {
      const product = limit
        ? await productsModel.find().limit(parseInt(limit))
        : await productsModel.find();
      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getProductById(pid) {
    try {
      const product = await productsModel.findById(pid);
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
