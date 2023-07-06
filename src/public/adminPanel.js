const deleteUserBtns = document.getElementsByClassName("deleteUser");
const deleteProductBtns = document.getElementsByClassName("deleteProduct");
const deleteUsers = document.getElementById("deleteInactiveUsers");

if (deleteUserBtns && deleteUserBtns.length > 0) {
  for (let i = 0; i < deleteUserBtns.length; i++) {
    deleteUserBtns[i].addEventListener("click", async () => {
      const { uid } = deleteUserBtns[i].dataset;
      const resp = await fetch(`/api/users/${uid}`, {
        method: "delete",
      });
      if (resp.ok) location.reload();
      else alert("Se ha producido un error, intentelo nuevamente");
    });
  }
}

if (deleteProductBtns && deleteProductBtns.length > 0) {
  for (let i = 0; i < deleteProductBtns.length; i++) {
    deleteProductBtns[i].addEventListener("click", async () => {
      const { pid } = deleteProductBtns[i].dataset;
      await fetch(`/api/products/${pid}`, {
        method: "delete",
      });
      location.reload();
    });
  }
}

if (deleteUsers) {
  deleteUsers.addEventListener("click", async () => {
    const resp = await fetch("/api/users", { method: "delete" });
    if (resp.ok) location.reload();
    else alert("Se ha producido un error, intentelo nuevamente");
  });
}
