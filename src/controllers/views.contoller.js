import cartsService from "../services/carts.service.js";
import productsService from "../services/products.service.js";
import ticketsService from "../services/tickets.service.js";
import usersService from "../services/users.service.js";
import CustomError from "../utils/errors/customError.utils.js";
import { ErrorEnums } from "../utils/errors/errors.enums.js";
import { verifyToken } from "../utils/jwt.utils.js";

class ViewsController {
  login(_req, res) {
    res.render("login");
  }

  register(_req, res) {
    res.render("register");
  }

  redirectToLogin(_req, res) {
    res.redirect("/views/login");
  }

  errorLogin(_req, res) {
    res.render("errorLogin");
  }

  errorRegister(_req, res) {
    res.render("errorRegister");
  }

  passRecover(_req, res) {
    res.render("recovery", { sent: false });
  }

  newPassword(req, res) {
    const { token } = req.params;
    try {
      verifyToken(token);
      res.cookie("recovery_token", token);
      res.render("newPassword", { auth: true });
    } catch (error) {
      res.render("newPassword", { auth: false });
    }
  }

  async getCartProducts(req, res) {
    try {
      const { cid } = req.params;
      const cart = await cartsService.getCartById(cid);
      const newCart = JSON.parse(JSON.stringify(cart));
      const render = true;
      res.render("cart", { render, cart: newCart });
    } catch (error) {
      const render = false;
      res.render("cart", { render });
    }
  }

  async getProducts(req, res) {
    const { limit = 10, page = 1, sort, query } = req.query;
    const user = req.user;

    const products = await productsService.getProducts({
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
        prevUrl = `${req.originalUrl.slice(0, i)}page=${
          products.prevPage
        }${req.originalUrl.slice(i + 6, req.originalUrl.length)}`;
      }
    }
    if (products.hasNextPage) {
      const i = req.originalUrl.indexOf("page=");
      if (i === -1) {
        nextUrl = `${req.originalUrl}?page=${products.nextPage}`;
      } else {
        nextUrl = `${req.originalUrl.slice(0, i)}page=${
          products.nextPage
        }${req.originalUrl.slice(i + 6, req.originalUrl.length)}`;
      }
    }
    const render = products.docs.length === 0 ? false : true;
    res.render("products", {
      isAdmin: req.session.isAdmin,
      user: user,
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
  }

  async getProduct(req, res) {
    try {
      const { pid } = req.params;
      const { cart } = req.user ? req.user : "";
      const product = await productsService.getProductById(pid);
      const render = true;
      res.render("product", {
        render,
        product,
        cartId: cart ? cart.toString() : "",
      });
    } catch (error) {
      const render = false;
      res.render("product", { render });
    }
  }

  async productForm(req, res) {
    const { pid } = req.query;
    if (!pid) return res.render("productForm");
    const product = await productsService.getProductById(pid);
    if (!product) CustomError.generateError(ErrorEnums.NOT_FOUND);
    return res.render("productForm", { product });
  }

  async activateChat(req, res) {
    const { fullName } = req.user;
    res.render("chat", { user: fullName });
  }

  async clientArea(req, res) {
    const user = req.user;
    const existingDocuments = {
      identification: false,
      address: false,
      account: false,
      avatar: false,
    };
    if (user.documents) {
      user.documents.forEach((item) => {
        existingDocuments[item.name] = true;
      });
    }
    const products = await productsService.getProducts({
      query: `owner:${user.email}`,
    });
    const tickets = await ticketsService.getTicketsByPurchaser(user.email);
    res.render("personal", {
      user,
      existingDocuments,
      products: products.docs || "",
      tickets,
    });
  }

  async adminArea(_req, res) {
    const users = await usersService.getAllUsers();
    const products = await productsService.getProducts();
    res.render("adminPanel", { users, products });
  }
}

export default new ViewsController();
