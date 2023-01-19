import { Router } from "express";
import { CartManager } from "../CartManager.js";
import { ProductManager } from "../ProductManager.js";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const productManager = new ProductManager(`${__dirname}../../productos.json`); //Instancio la clase para poder verificar que el producto a agregar en el carrito exista en el archivo de productos.

const router = Router();
const cartManager = new CartManager(`${__dirname}../../carts.json`); //Ruta absoluta para el archivo que guarda el array de carritos

//Funcion para verificar que exista el producto. Luego la paso como middleware al metodo POST
async function productExists(req, res, next) {
  try {
    const { pid } = req.params;
    const productToAdd = await productManager.getProductById(pid);
    productToAdd && next();
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

router.post("/", async (req, res) => {
  const newCart = await cartManager.createCart();
  res
    .status(200)
    .json({ message: "Nuevo carrito generado con éxito", cart: newCart });
});

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const products = await cartManager.getCartById(parseInt(cid));
    res.json({
      message: `Productos del carrito con id: ${cid} obtenido con éxito`,
      products,
    });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

//Aqui implemento el middleware que, de existir el producto, permite continuar. De lo contario devuelve un objeto de error.
router.post("/:cid/product/:pid", productExists, async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartManager.addProductToCart(
      parseInt(cid),
      parseInt(pid)
    );
    res.status(200).json({ message: "Producto agregado con éxito", cart });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

export default router;
