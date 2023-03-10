import { Router } from "express";

import { CartManager } from "../dao/mongoManagers/CartManager.js";
import { ProductManager } from "../dao/mongoManagers/ProductManager.js";
//import { CartManager } from "../dao/fileManagers/CartManager.js";
//import { ProductManager } from "../dao/fileManagers/ProductManager.js";

const productManager = new ProductManager(); //Instancio la clase para verificar que el producto a agregar existe.
const cartManager = new CartManager(); //Instancia de la clase para gestionar el carrito

const router = Router();

//Funcion para verificar que exista el producto. Luego la paso como middleware al metodo POST
async function productExists(req, res, next) {
  try {
    const { pid } = req.params;
    await productManager.getProductById(pid);
    next();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

//Rutas
//La ruta crea un carrito con un array vacio de productos
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res
      .status(200)
      .json({ message: "Nuevo carrito generado con éxito", cart: newCart });
  } catch (error) {
    res.json({ error: error.message });
  }
});

//Permite obtener todos los productos que se encuentran en el carrito indicado, mostrando la informacion completa
router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    res.json({
      message: `Productos del carrito con id: ${cid} obtenido con éxito`,
      cart,
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

//Aqui implemento el middleware que, de existir el producto, permite continuar. De lo contario devuelve un objeto de error.
router.post("/:cid/product/:pid", productExists, async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartManager.addProductToCart(cid, pid);
    res.status(200).json({ message: "Producto agregado con éxito", cart });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

//Ruta que permite modificar el array completo de productos del carrito, recibiendo por body un nuevo array con id y cantidad
router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const products = req.body;
  const cart = await cartManager.updateCart(cid, products);
  res.json({
    message: "Carrito actualizado",
    cart,
  });
});

//La ruta permite actualizar la cantidad del producto referenciado, recibiendo este valor por body
router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const quantity = req.body.quantity;
  const cart = await cartManager.updateProductInCart(cid, pid, quantity);
  res.json({
    message: `El producto con id: ${pid} ha sido actualizado`,
    cart,
  });
});

//La ruta permite eliminar un producto del arreglo productos en el carrito que se referencia
router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const cart = await cartManager.deleteProductById(cid, pid);
  res.json({
    message: `Eliminado el producto con el id: ${pid} del carrito`,
    cart,
  });
});

//La ruta permite eliminar todos los productos de un carrito. No elimina el carrito de la base de datos.
router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await cartManager.deleteProducts(cid);
  res.json({
    message: `Eliminados todos los productos del carrito con id: ${cid}`,
    cart,
  });
});

export default router;
