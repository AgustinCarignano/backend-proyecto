import fs from "fs";
import { __dirname } from "../../utils.js";

const path = `${__dirname}/files/productos.json`;

export class ProductManager {
  async getProducts(limit) {
    try {
      if (fs.existsSync(path)) {
        const productFile = await fs.promises.readFile(path, "utf-8");
        const products = limit
          ? JSON.parse(productFile).slice(0, parseInt(limit))
          : JSON.parse(productFile);
        return products; //retorna el array completo o solo una cantidad limitada por el parametro "limit"
      } else {
        return [];
      }
    } catch (error) {
      return error;
    }
  }
  async getProductById(pid) {
    const products = await this.getProducts();
    const searchedProduct = products.find(
      (product) => product.id === parseInt(pid)
    );
    return searchedProduct
      ? searchedProduct
      : this.#generateError(
          `Not found. No existe un producto con el id: ${pid}`
        );
  }
  async addProduct(productObj) {
    const products = await this.getProducts();
    if (
      productObj.title &&
      productObj.description &&
      productObj.price &&
      productObj.thumbnail &&
      productObj.code &&
      productObj.stock &&
      typeof productObj.status === "boolean" &&
      productObj.category
    ) {
      const codeAlredyExist = products.some(
        (product) => product.code === productObj.code
      );
      if (!codeAlredyExist) {
        const product = {
          ...productObj,
          id: await this.#createId(),
        }; //coloco el id autogenerado luego del spread del objeto para que, en caso de haber ingresado una propiedad id, sobreescribirla.
        products.push(product);
        await this.#writeFile(products);
        return product;
      } else {
        this.#generateError(
          "No pueden existir dos productos con el mismo código"
        );
      }
    } else {
      this.#generateError(
        "Error al cargar el producto. No se permiten campos vacios en las propiedades del producto."
      );
    }
  }
  async updateProduct(pid, newObject) {
    newObject.id && delete newObject.id; //con esta linea me aseguro de que no se modifique el id del objeto ya cargado en el array de productos
    const products = await this.getProducts();
    const productIndex = products.findIndex(
      (prod) => prod.id === parseInt(pid)
    );
    productIndex === -1 &&
      this.#generateError(`No existe un producto con el id: ${pid}`);
    products[productIndex] = { ...products[productIndex], ...newObject }; //sobreescribe las propiedades que se reciban por paramtero
    await this.#writeFile(products);
    return products[productIndex];
  }
  async deleteProduct(pid) {
    const products = await this.getProducts();
    let i = products.findIndex((producto) => producto.id === parseInt(pid));
    i === -1 && this.#generateError(`No existe un producto con el id: ${pid}`);
    products.splice(i, 1);
    await this.#writeFile(products);
    return parseInt(pid);
  }
  async #createId() {
    try {
      const productFile = await this.getProducts();
      const id =
        productFile.length === 0
          ? 1
          : productFile[productFile.length - 1].id + 1;
      return id;
    } catch (error) {
      return error;
    }
  }
  #generateError(message) {
    throw new Error(message);
  }
  async #writeFile(product) {
    try {
      await fs.promises.writeFile(path, JSON.stringify(product));
    } catch (error) {
      return error;
    }
  }
}
