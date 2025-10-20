import mongoose from "mongoose";

const tipoTurnoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  duracion: { type: Number, required: true }
});

const TipoTurno = mongoose.model("TipoTurno", tipoTurnoSchema);

export default TipoTurno;
