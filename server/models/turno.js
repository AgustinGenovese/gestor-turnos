// models/turno.js
import mongoose from "mongoose";

const turnoSchema = new mongoose.Schema({
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente'},
  peluquero: { type: mongoose.Schema.Types.ObjectId, ref: 'Peluquero'},
  tipoTurno: { type: mongoose.Schema.Types.ObjectId, ref: 'TipoTurno', required: true },
  fechaHora: { type: Date, required: true },
  productosVendidos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Producto' }],
  precioTotal: { type: Number, required: true },
  estado: {
    type: String,
    enum: ["pendiente", "cancelado", "cobrado"],
    default: "pendiente"
  }
});

const Turno = mongoose.model("Turno", turnoSchema);

export default Turno;
