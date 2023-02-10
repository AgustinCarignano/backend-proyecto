import { Router } from "express";

// import { ProductManager } from "../dao/fileManagers/ProductManager.js";
import { ProductManager } from "../dao/mongoManagers/ProductManager.js";

const router = Router();
const productManager = new ProductManager(); //Instancia de la clase para gestionar los productos

//La ruta get acepta tambien el query param de "limit"
router.get("/", async (req, res) => {
  const { limit } = req.query;
  const products = await productManager.getProducts(limit);
  res.json({ status: "success", products });
});

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);
    res.json({ status: "success", product });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const productToAdd = req.body;
    const newProduct = await productManager.addProduct(productToAdd);
    res
      .status(200)
      .json({ message: "Producto cargado con éxito", product: newProduct });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//La verificacion para que no se modifique el id del producto se realiza en el mismo metodo "updateProduct"
router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const modifiedProduct = req.body;
    const newProduct = await productManager.updateProduct(pid, modifiedProduct);
    res.status(200).json({
      message: "Producto modificado con éxito",
      modifiedProduct: newProduct,
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const id = await productManager.deleteProduct(pid);
    res.json({ message: "producto eliminado con éxito", id });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default router;
