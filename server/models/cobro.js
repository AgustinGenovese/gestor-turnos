import mongoose from "mongoose";

const cobroSchema = new mongoose.Schema({
  metodoPago: { type: String, required: true },
  monto: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
  observaciones: { type: String, default: "" }
});

const Cobro = mongoose.model("Cobro", cobroSchema);

export default Cobro;