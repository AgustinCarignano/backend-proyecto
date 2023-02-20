import { Router } from "express";
import { ProductManager } from "../../dao/mongoManagers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

//Solo dos rutas para obtener la lista completa de productos, con el mismo formado definido en la api, y los datos de un solo productos.
//Se renderizan vistas distintas en cada caso
router.get("/", async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;

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

  const render = products.docs.length === 0 ? false : true;

  res.render("products", {
    status: "success",
    render: render,
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
});

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);
    const render = true;
    res.render("product", { render, product });
  } catch (error) {
    const render = false;
    res.render("product", { render });
  }
});

export default router;
