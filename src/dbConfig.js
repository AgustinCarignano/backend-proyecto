import mongoose from "mongoose";

const URI =
  "mongodb+srv://agustinCarignano:agustinCarignanoCluster@ac-cluster.spgonex.mongodb.net/ecommerce?retryWrites=true&w=majority";
mongoose.set("strictQuery", true);
mongoose.connect(URI, (error) => {
  if (error) {
    console.log("Se ha producido un error en la conexíon: ", error);
  } else {
    console.log("Conectado a la base de datos");
  }
});
