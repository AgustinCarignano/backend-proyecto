import productsDAO from "../persistence/DAOs/productsDAO/productsMongo.js";

class ProductsService {
  async getProducts(params) {
    try {
      const product = await productsDAO.getProducts(params);
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
      const product = await productsDAO.getProductById(pid);
      await productsDAO.deleteProduct(pid);
      return product;
    } catch (error) {
      return error;
    }
  }
  async transferProductOwner(ownerList) {
    if (ownerList.length === 0) return;
    ownerList.forEach(async (userEmail) => {
      await productsDAO.changeOwner(userEmail);
    });
    return;
  }
}

export default new ProductsService();
