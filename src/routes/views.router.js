import { Router } from "express";
import { CartManager } from "../dao/mongoManagers/CartManager.js";
import { ProductManager } from "../dao/mongoManagers/ProductManager.js";
import { isNotLogged, isLogged } from "../middlewares/auth.middleware.js";

const router = Router();

const cartManager = new CartManager();
const productManager = new ProductManager();

//ruta raiz redirige a la vista de login
router.get("/", (req, res) => {
  res.redirect("/views/login");
});

//Ruta para Login
router.get("/login", isLogged, (req, res) => {
  res.render("login");
});

router.get("/login/errorLogin", (req, res) => {
  res.render("errorLogin");
});

//Ruta para registro
router.get("/register", isLogged, (req, res) => {
  res.render("register");
});

router.get("/register/errorRegister", isLogged, (req, res) => {
  res.render("errorRegister");
});

//Ruta para carrito
//Se obtinen los datos de los productos de un determinado carrito y se genera una vista
router.get("/carts/:cid", isNotLogged, async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    const render = true;
    res.render("cart", { render, cart });
  } catch (error) {
    const render = false;
    res.render("cart", { render });
  }
});

//Ruta de productos
//Solo dos rutas para obtener la lista completa de productos, con el mismo formado definido en la api, y los datos de un solo productos.
//Se renderizan vistas distintas en cada caso
router.get("/products", isNotLogged, async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;
  const { userSession } = req.signedCookies;

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
    user: userSession,
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

router.get("/products/:pid", isNotLogged, async (req, res) => {
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
