const update = document.getElementById("updateProduct");
const create = document.getElementById("createProduct");

if (update) {
  update.addEventListener("submit", async (e) => {
    e.preventDefault();
    const { pid } = update.dataset;
    const body = {
      title: update.querySelector("input[name=title]").value,
      price: update.querySelector("input[name=price]").value,
      thumbnail: update.querySelector("input[name=thumbnail]").value,
      code: update.querySelector("input[name=code]").value,
      stock: update.querySelector("input[name=stock]").value,
      category: update.querySelector("input[name=category]").value,
      description: update.querySelector("textarea[name=description]").value,
      status: true,
    };
    const resp = await fetch(`/api/products/${pid}`, {
      method: "put",
      body: JSON.stringify(body),
      headers: {
        "content-Type": "application/json",
      },
    });
    if (resp.ok) {
      alert("Producto actualizado exitosamente");
      location.reload();
    } else {
      alert("Se ha producido un error, intentelo nuevamente");
    }
  });
}

if (create) {
  create.addEventListener("submit", async (e) => {
    e.preventDefault();
    const body = {
      title: create.querySelector("input[name=title]").value,
      price: create.querySelector("input[name=price]").value,
      thumbnail: create.querySelector("input[name=thumbnail]").value,
      code: create.querySelector("input[name=code]").value,
      stock: create.querySelector("input[name=stock]").value,
      category: create.querySelector("input[name=category]").value,
      description: create.querySelector("textarea[name=description]").value,
      status: true,
    };
    const resp = await fetch(`/api/products`, {
      method: "post",
      body: JSON.stringify(body),
      headers: {
        "content-Type": "application/json",
      },
    });
    if (resp.ok) {
      alert("Producto creado exitosamente");
      location.reload();
    } else {
      alert("Se ha producido un error, intentelo nuevamente");
    }
  });
}
