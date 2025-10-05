import mongoose from "mongoose";

const peluqueroSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  turnosAsignados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Turno' }]
});

const Peluquero = mongoose.model("Peluquero", peluqueroSchema);

export default Peluquero;