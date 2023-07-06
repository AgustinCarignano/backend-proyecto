import { Router } from "express";
import productsController from "../controllers/products.controller.js";
import { isOwnerOrAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", productsController.getProducts);
router.get("/:pid", productsController.getProductById);
router.post("/", isOwnerOrAdmin, productsController.addProduct);
router.put("/:pid", isOwnerOrAdmin, productsController.updateProduct);
router.delete("/:pid", isOwnerOrAdmin, productsController.deleteProduct);

export default router;
