const btn = document.getElementById("addToCart");
const div = document.getElementById("linkToCart");
let usuario = null;
const usuarios = [];

btn.onclick = async () => {
  const { product_id, cart_id } = btn.dataset;
  await fetch(`/api/carts/${cart_id}/product/${product_id}`, {
    method: "POST",
    headers: {
      "content-Type": "application/json",
    },
  });

  if (!existLink) {
    const anchor = document.createElement("a");
    anchor.innerHTML = `<a href="/views/carts/${cart_id}">Ver Carrito<a>`;
    div.appendChild(anchor);
    existLink = true;
  }
};
