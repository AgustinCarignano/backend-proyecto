import { Router } from "express";

// import { ProductManager } from "../dao/fileManagers/ProductManager.js";
import { ProductManager } from "../dao/mongoManagers/ProductManager.js";

const productManager = new ProductManager(); //Instancia de la clase para gestionar los productos

const router = Router();

//La ruta permite obtener una lista de productos, y puede recibir hasta cuatro parametros por query.
//"limit=number" y "page=number" son asignados por defecto si no se ingresa en la ruta.
//"sort=asc/desc" permite ordenar los productos de forma ascendente o descendente segun el precio
//"query=category:Categoria 2" o "query=status:true/false" filtra los productos del carrito
router.get("/", async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;

  try {
    const products = await productManager.getProducts({
      limit,
      page,
      sort,
      query,
    });

    //los siguientes bloques condicionales son para construir la ruta de la pagina previa o siguiente
    let prevUrl = null;
    let nextUrl = null;
    if (products.hasPrevPage) {
      const i = req.originalUrl.indexOf("page=");
      if (i === -1) {
        prevUrl = `${req.originalUrl}?page=${products.prevPage}`;
      } else {
        prevUrl = `${req.originalUrl.substring(0, i)}page=${
          products.prevPage
        }${req.originalUrl.substring(i + 6, req.originalUrl.length)}`;
      }
    }
    if (products.hasNextPage) {
      const i = req.originalUrl.indexOf("page=");
      if (i === -1) {
        nextUrl = `${req.originalUrl}?page=${products.nextPage}`;
      } else {
        nextUrl = `${req.originalUrl.substring(0, i)}page=${
          products.nextPage
        }${req.originalUrl.substring(i + 6, req.originalUrl.length)}`;
      }
    }

    //Estructura de la respuesta
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

//Ruta para obtener la informacion de un producto en particular
router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);
    res.json({ status: "success", product });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

//Ruta para cargar uno o mas productos a la base de datos
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

//Ruta para actualizar los datos de un producto determinado.
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

//Ruta para eliminar un producto determinado de la base de datos
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
