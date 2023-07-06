const btn = document.getElementById("addToCart");
const div = document.getElementById("linkToCart");
existLink = false;

btn.onclick = async () => {
  const { product_id, cart_id } = btn.dataset;
  const res = await fetch(`/api/carts/${cart_id}/product/${product_id}`, {
    method: "POST",
    headers: {
      "content-Type": "application/json",
    },
  });
  if (res.status === 403) {
    alert(
      "You are the owner of this product and you cannot add it to your cart"
    );
  }

  if (!existLink) {
    const anchor = document.createElement("a");
    anchor.innerHTML = `<a href="/views/carts/${cart_id}">Ver Carrito<a>`;
    div.appendChild(anchor);
    existLink = true;
  }
};
