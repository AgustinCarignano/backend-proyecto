import { Router } from "express";
import { ProductManager } from "../../dao/mongoManagers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

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
  const payload = products.docs;
  res.render("products", { payload });
  /* res.render("products", {
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
  }); */
});

export default router;
