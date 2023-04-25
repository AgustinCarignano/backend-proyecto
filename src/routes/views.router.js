import { Router } from "express";
import viewsController from "../controllers/views.contoller.js";
import {
  isLogged,
  isNotLogged,
} from "../middlewares/protectRoutes.middleware.js";
import { isUserAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/login", isLogged, viewsController.login);

router.get("/", isLogged, viewsController.redirectToLogin);

router.get("/login/errorLogin", viewsController.errorLogin);

router.get("/register", isLogged, viewsController.register);

router.get("/register/errorRegister", isLogged, viewsController.errorRegister);

router.get("/carts/:cid", isNotLogged, viewsController.getCartProducts);

router.get("/products", isNotLogged, viewsController.getProducts);

router.get("/products/:pid", isNotLogged, viewsController.getProduct);

router.get("/messages", isUserAuth, viewsController.activateChat);

export default router;
