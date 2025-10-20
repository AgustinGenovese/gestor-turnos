import mongoose from "mongoose";
import bcrypt from "bcrypt";

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ["admin", "user"], default: "user" },
  creadoEn: { type: Date, default: Date.now }
});

// Middleware para hashear la contraseña antes de guardar, solo si fue modificada
usuarioSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const Usuario = mongoose.model("Usuario", usuarioSchema);
export default Usuario;
