import { Router } from "express";

// import { ProductManager } from "../dao/fileManagers/ProductManager.js";
import { ProductManager } from "../dao/mongoManagers/ProductManager.js";

const router = Router();
const productManager = new ProductManager(); //Instancia de la clase para gestionar los productos

//La ruta get acepta tambien el query param de "limit"
router.get("/", async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;

  try {
    const products = await productManager.getProducts({
      limit,
      page,
      sort,
      query,
    });

    let prevUrl = null;
    let nextUrl = null;
    if (products.hasPrevPage) {
      const i = req.originalUrl.indexOf("page=");
      prevUrl = `${req.originalUrl.substring(0, i)}page=${
        products.prevPage
      }${req.originalUrl.substring(i + 6, req.originalUrl.length)}`;
    }
    if (products.hasNextPage) {
      const i = req.originalUrl.indexOf("page=");
      nextUrl = `${req.originalUrl.substring(0, i)}page=${
        products.nextPage
      }${req.originalUrl.substring(i + 6, req.originalUrl.length)}`;
    }

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
