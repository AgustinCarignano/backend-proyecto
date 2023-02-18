const btn = document.getElementById("addToCart");
const div = document.getElementById("linkToCart");
let usuario = null;
const usuarios = [];

btn.onclick = async () => {
  await fetch(`/api/carts/63ee08dedfd48a7e16da594d/product/${btn.name}`, {
    method: "POST",
    headers: {
      "content-Type": "application/json",
    },
  });
  const anchor = document.createElement("a");
  anchor.innerHTML = `<a href="/carts/63ee08dedfd48a7e16da594d">Ver Carrito<a>`;
  div.appendChild(anchor);
};
/* btn.onclick = async () => {
  const dataNewCart = await fetch("/api/carts/", {
    method: "POST",
    headers: {
      "content-Type": "application/json",
    },
  });
  const respNewCart = await dataNewCart.json();
  const newCart = respNewCart.cart;
  const cartId = newCart._id;

  await fetch(`/api/carts/${cartId}/product/${btn.name}`, {
    method: "POST",
    headers: {
      "content-Type": "application/json",
    },
  });
  div.innerHTML = `
  <a href="/carts/${cartId}">Ver Carrito<a>
  `;
}; */
