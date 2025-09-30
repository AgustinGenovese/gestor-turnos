import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  turnos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Turno' }]
});

const Cliente = mongoose.model("Cliente", clienteSchema);

export default Cliente;