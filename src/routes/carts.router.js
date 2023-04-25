import { Router } from "express";
import cartsController from "../controllers/carts.controller.js";
import { isUserAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", cartsController.createCart);
router.get("/:cid", cartsController.getCart);
router.post("/:cid/product/:pid", isUserAuth, cartsController.addProduct);
router.put("/:cid", cartsController.updateCart);
router.put("/:cid/products/:pid", cartsController.updateProduct);
router.delete("/:cid/products/:pid", cartsController.deleteProduct);
router.delete("/:cid", cartsController.cleanCart);
router.get("/:cid/purchase", isUserAuth, cartsController.checkOut);

export default router;
