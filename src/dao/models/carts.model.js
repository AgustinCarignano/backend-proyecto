import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  products: [
    {
      productId: {
        type: String,
      },
      quantity: {
        type: Number,
      },
    },
  ],
});

export const cartsModel = mongoose.model("cart", cartSchema);

/* {
        id: {
          type: String,
          required: true,
          unique: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      }, */

/* 

      // Esquema de estudiante
const EstudianteSchema = new mongoose.Schema({
  codigoRude: { // quitamos la restricción 'unique' y la condición de 'index'
    type: String,
    required: true
  },
  // Otros campos propios del Estudiante
});

// Esquema de profesor
const ProfesorSchema = new mongoose.Schema({
  rda: { // quitamos la restricción 'unique' y la condición de 'index'
    type: String,
    required: true,
  },
  // Otros campos propios del Profesor
});

// Esquema de padre
const ParentSchema = new mongoose.Schema({
   // Otros campos propios del Padre de familia
});

// Esquema de Usuario
const UsuarioSchema = new mongoose.Schema({
  // ... datos adicionales
  email: {
    type: String,
    required: true,
    index: true, // <- índice a nivel de campo, este lo mantenemos
    unique: true
  },
  // ... otros campos
  // campos con documentos embebidos
  estudiante: {
    type: EstudianteSchema
  },
  profesor: {
    type: ProfesorSchema
  },
  parent: {
    type: ParentSchema
  }
}, {collection: 'users', timestamps: {createdAt: 'created', updatedAt: 'updated'}});

// creamos índices parciales sobre los campos opcionales

// sobre 'profesor.codigoRude'
UsuarioSchema.index(
  { 'profesor.codigoRude': 1 },
  { 
    partialFilterExpression: { 'profesor.codigoRude': { $exists: true } },
    unique: 1
  }
);

// sobre 'estudiante.rda'
UsuarioSchema.index(
  { 'estudiante.rda': 1 },
  { 
    partialFilterExpression: { 'estudiante.rda': { $exists: true } },
    unique: 1
  }
);

// ahora podemos crear nuestro modelo
const Usuario = mongoose.model('Usuario', UsuarioSchema);


 */
