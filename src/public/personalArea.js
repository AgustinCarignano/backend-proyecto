const deleteBtns = document.getElementsByClassName("deleteProductBtn");
const editBtns = document.getElementsByClassName("editProductBtn");
const deleteCount = document.getElementById("deleteCount");

if (deleteBtns && deleteBtns.length > 0) {
  for (let i = 0; i < deleteBtns.length; i++) {
    deleteBtns[i].addEventListener("click", async () => {
      const { pid } = deleteBtns[i].dataset;
      const resp = await fetch(`/api/products/${pid}`, { method: "delete" });
      if (resp.ok) location.reload();
      else alert("Ha ocurrido un error y no se pudo eliminar");
    });
  }
}

if (deleteCount) {
  deleteCount.addEventListener("click", () => {
    const { uid } = deleteCount.dataset;
    Swal.fire({
      title: "¿Desea eliminar su cuenta?",
      text: "No podra revertir esta accion. Se eliminaran tambien, si existen, los documentos asociados a la cuenta",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const resp = await fetch(`/api/users/${uid}`, { method: "delete" });
        if (resp.ok) location.reload();
      }
    });
  });
}
