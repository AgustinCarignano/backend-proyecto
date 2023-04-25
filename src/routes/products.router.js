import { Router } from "express";
import productsController from "../controllers/products.controller.js";
import { isAdminAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", productsController.getProducts);
router.get("/:pid", productsController.getProductById);
router.post("/", isAdminAuth, productsController.addProduct);
router.put("/:pid", isAdminAuth, productsController.updateProduct);
router.delete("/:pid", isAdminAuth, productsController.deleteProduct);

export default router;
