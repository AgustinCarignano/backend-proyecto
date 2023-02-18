import { Router } from "express";
import { CartManager } from "../../dao/mongoManagers/CartManager.js";

const router = Router();
const cartManager = new CartManager();

//Se obtinen los datos de los productos de un determinado carrito y se genera una vista
router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await cartManager.getCartById(cid);
  res.render("cart", { cart });
});

export default router;
