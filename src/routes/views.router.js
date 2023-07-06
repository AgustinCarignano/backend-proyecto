import { Router } from "express";
import viewsController from "../controllers/views.contoller.js";
import {
  isLogged,
  isNotLogged,
} from "../middlewares/protectRoutes.middleware.js";
import {
  isAdmin,
  isAdminAuth,
  isUserAuth,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/login", isLogged, viewsController.login);

router.get("/", isLogged, viewsController.redirectToLogin);

router.get("/login/errorLogin", viewsController.errorLogin);

router.get("/register", isLogged, viewsController.register);

router.get("/register/errorRegister", isLogged, viewsController.errorRegister);

router.get("/recovery_password", isLogged, viewsController.passRecover);

router.get("/newPassword/:token", viewsController.newPassword);

router.get("/carts/:cid", isNotLogged, viewsController.getCartProducts);

router.get("/products", isNotLogged, viewsController.getProducts);

router.get("/products/form", isNotLogged, viewsController.productForm);

router.get("/products/:pid", isNotLogged, viewsController.getProduct);

router.get("/messages", viewsController.activateChat);

router.get("/clientArea", isNotLogged, viewsController.clientArea);

router.get("/adminPanel", isAdminAuth, viewsController.adminArea);

export default router;
