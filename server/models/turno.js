import mongoose from "mongoose";

const turnoSchema = new mongoose.Schema({
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  tipoTurno: { type: mongoose.Schema.Types.ObjectId, ref: 'TipoTurno', required: true },
  fechaHora: { type: Date, required: true }
});

const Turno = mongoose.model("Turno", turnoSchema);

export default Turno;
