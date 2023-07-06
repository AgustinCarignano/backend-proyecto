import { Router } from "express";
import cartsController from "../controllers/carts.controller.js";
import { isUserAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", cartsController.createCart);
router.get("/:cid", cartsController.getCart);
router.post("/:cid/product/:pid", isUserAuth, cartsController.addProduct);
router.put("/:cid", isUserAuth, cartsController.updateCart); //actuliza muchos productos del carrito
router.put("/:cid/products/:pid", isUserAuth, cartsController.updateProduct); //actializa un producto dentro del carrito
router.delete("/:cid/products/:pid", isUserAuth, cartsController.deleteProduct); //Elimina un producto del carrito
router.delete("/:cid", isUserAuth, cartsController.cleanCart); //Elimina todos los productos del carrito
router.get("/:cid/purchase", isUserAuth, isUserAuth, cartsController.checkOut); //hace el checkout del carrito

export default router;
