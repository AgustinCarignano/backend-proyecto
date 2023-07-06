const checkOutBtn = document.getElementById("checkOut");
const cartList = document.getElementById("cartList");
const cartRemain = document.getElementById("cartOutStock");
const ticketDiv = document.getElementById("cartTicket");
const cleanCart = document.getElementById("cleanCart");

if (checkOutBtn) {
  checkOutBtn.onclick = async () => {
    const { id } = checkOutBtn.dataset;
    const response = await fetch(`/api/carts/${id}/purchase`);
    if (response.ok) {
      const { ticket, productsOutOfStock } = await response.json();
      if (!ticket) {
        generateProductsList(productsOutOfStock);
      } else if (productsOutOfStock.length > 0) {
        generateProductsList(productsOutOfStock);
        generateViewTicket(ticket);
      } else {
        generateViewTicket(ticket);
      }
      cartList.innerHTML = "";
    }
  };
}

function generateProductsList(products) {
  cartRemain.innerHTML = `
      <h3>Productos sin stock</h3>
      <div class="flex-column">
        <h4>Nombre</h4>
    `;
  products.forEach((item) => {
    cartRemain.innerHTML += `
        <p>${item.title}</p>
      `;
  });
}

function generateViewTicket(ticket) {
  ticketDiv.innerHTML = `
    <h3>Ticket de compra</h3>
    <div class="grid-4">
      <h4>Codigo</h4>
      <h4>Fecha</h4>
      <h4>Contacto</h4>
      <h4>Total</h4>
      <p>${ticket.code}</p>
      <p>${ticket.purchase_datatime}</p>
      <p>${ticket.purchaser}</p>
      <p>${ticket.amount}</p>
    </div>
  `;
}

if (cleanCart) {
  cleanCart.addEventListener("click", async (e) => {
    e.preventDefault();
    const { id } = cleanCart.dataset;
    const response = await fetch(`/api/carts/${id}`, {
      method: "delete",
    });
    if (response.ok) location.reload();
    else alert("Se ha producido un error, vuelva a intentarlo");
  });
}
