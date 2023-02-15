import { Router } from "express";
import { CartManager } from "../../dao/mongoManagers/CartManager.js";

const router = Router();
const cartManager = new CartManager();

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await cartManager.getCartById(cid);
  res.render("cart", cart);
});

export default router;
