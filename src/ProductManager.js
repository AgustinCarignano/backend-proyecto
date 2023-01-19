import fs from "fs";

export class ProductManager {
  constructor(path) {
    this.path = path;
  }
  async addProduct(productObj) {
    const products = await this.getProducts("all");
    let statusForVerification; //como recibe un boolean que puede ser "false", utilizo esta variable para comprobar que el campo no este vacio.
    if (productObj.status === false) statusForVerification = true;
    if (
      productObj.title &&
      productObj.description &&
      productObj.price &&
      productObj.thumbnail &&
      productObj.code &&
      productObj.stock &&
      statusForVerification &&
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
  async getProducts(limit) {
    try {
      if (fs.existsSync(this.path)) {
        const productFile = await fs.promises.readFile(this.path, "utf-8");
        return limit === "all"
          ? JSON.parse(productFile)
          : JSON.parse(productFile).slice(0, parseInt(limit)); //retorna el array completo o solo una cantidad limitada por el parametro "limit"
      } else {
        return [];
      }
    } catch (error) {
      return error;
    }
  }
  async getProductById(id) {
    const products = await this.getProducts("all");
    const searchedProduct = products.find(
      (product) => product.id === parseInt(id)
    );
    return searchedProduct
      ? searchedProduct
      : this.#generateError(
          `Not found, No existe un producto con el id: ${id}`
        );
  }
  async updateProduct(productId, newObject) {
    newObject.id && delete newObject.id; //con esta linea me aseguro de que no se modifique el id del objeto ya cargado en el array de productos
    const products = await this.getProducts("all");
    const productIndex = products.findIndex((prod) => prod.id === productId);
    productIndex === -1 &&
      this.#generateError(`No existe un producto con el id: ${productId}`);
    products[productIndex] = { ...products[productIndex], ...newObject }; //sobreescribe las propiedades que se reciban por paramtero
    await this.#writeFile(products);
    return products[productIndex];
  }
  async deleteProduct(productId) {
    const products = await this.getProducts("all");
    let i = products.findIndex((producto) => producto.id === productId);
    i === -1 &&
      this.#generateError(`No existe un producto con el id: ${productId}`);
    products.splice(i, 1);
    await this.#writeFile(products);
  }
  async #createId() {
    try {
      const productFile = await this.getProducts("all");
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
      await fs.promises.writeFile(this.path, JSON.stringify(product));
    } catch (error) {
      return error;
    }
  }
}
