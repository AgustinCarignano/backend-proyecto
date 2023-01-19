import { Router } from "express";
import { ProductManager } from "../ProductManager.js";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const router = Router();
const productManager = new ProductManager(`${__dirname}../../productos.json`); //Ruta absoluta para el archivo del array de productos.

//La ruta get acepta tambien el query param de "limit"
router.get("/", async (req, res) => {
  const { limit } = req.query;
  const products = await productManager.getProducts(limit || "all");
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
    const newProduct = await productManager.updateProduct(
      parseInt(pid),
      modifiedProduct
    );
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
    await productManager.deleteProduct(parseInt(pid));
    res.json({ message: "producto eliminado con éxito" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default router;
