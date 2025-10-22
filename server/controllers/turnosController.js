import Turno from "../models/turno.js";
import TipoTurno from "../models/tipoTurno.js";
import Cliente from "../models/cliente.js";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

const ZONA_ARG = "America/Argentina/Buenos_Aires"; // zona horaria del negocio

export const obtenerHorariosDisponibles = async (req, res) => {
  try {
    const { fecha } = req.query;
    if (!fecha) return res.status(400).json({ msg: "Falta la fecha" });

    // 1️⃣ Interpretar la fecha en la zona horaria local
    const inicioDiaLocal = dayjs.tz(fecha, ZONA_ARG).startOf("day");
    const finDiaLocal = inicioDiaLocal.endOf("day");

    // 2️⃣ Convertir a UTC para consultar Mongo
    const inicioDiaUTC = inicioDiaLocal.utc().toDate();
    const finDiaUTC = finDiaLocal.utc().toDate();

    // 3️⃣ Buscar turnos del día
    const turnosOcupados = await Turno.find({
      fechaHora: { $gte: inicioDiaUTC, $lte: finDiaUTC }
    });

    // 4️⃣ Generar horarios posibles (9:00 a 18:00 cada 30 minutos)
    const horariosPosibles = [];
    const apertura = 9;
    const cierre = 18;
    const intervalo = 30; // minutos

    for (let h = apertura; h < cierre; h++) {
      for (let m of [0, intervalo]) {
        const horarioLocal = inicioDiaLocal.hour(h).minute(m).second(0);
        const horarioUTC = horarioLocal.utc().toDate(); // UTC real para comparar
        horariosPosibles.push(horarioUTC);
      }
    }

    // 5️⃣ Filtrar los ocupados usando timestamps
    const ocupadosTimestamps = turnosOcupados.map(
      t => new Date(t.fechaHora).getTime()
    );

    const disponibles = horariosPosibles.filter(
      h => !ocupadosTimestamps.includes(h.getTime())
    );

    // 6️⃣ Convertir los disponibles a formato "HH:mm" (local)
    const horariosLibres = disponibles.map(h =>
      dayjs(h).tz(ZONA_ARG).format("HH:mm")
    );

    // 7️⃣ Enviar respuesta
    if (horariosLibres.length === 0)
      return res.json({ msg: "No hay turnos disponibles", horarios: [] });

    res.json({ horarios: horariosLibres });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener horarios" });
  }
};

export const crearTurno = async (req, res) => {
  try {
    const { cliente, tipoTurno, fechaHora } = req.body;

    // 1️⃣ Validar datos obligatorios
    if (!cliente || !tipoTurno || !fechaHora) {
      return res.status(400).json({ msg: "Faltan datos obligatorios" });
    }

    // 2️⃣ Convertir string ISO a Date en zona Argentina y luego a UTC
    const fecha = dayjs.tz(fechaHora, ZONA_ARG).toDate();
    if (isNaN(fecha.getTime()) || fecha < new Date()) {
      return res.status(400).json({ msg: "Fecha/hora inválida o pasada" });
    }

    // 3️⃣ Buscar o crear cliente
    let clienteDoc = await Cliente.findOne({ email: cliente.email });
    if (!clienteDoc) {
      clienteDoc = new Cliente({
        nombre: cliente.nombre, email: cliente.email, telefono: cliente.telefono,
      });
      await clienteDoc.save();
    } else {
      // 🔄 Si existe, actualizo nombre o teléfono si cambiaron
      let cambios = false;
      if (cliente.nombre && cliente.nombre !== clienteDoc.nombre) {
        clienteDoc.nombre = cliente.nombre;
        cambios = true;
      }
      if (cliente.telefono && cliente.telefono !== clienteDoc.telefono) {
        clienteDoc.telefono = cliente.telefono;
        cambios = true;
      }
      if (cambios) await clienteDoc.save();
    }

    // 4️⃣ Verificar que no exista turno en la misma fecha/hora
    const turnoExistente = await Turno.findOne({ fechaHora: fecha });
    if (turnoExistente) {
      return res.status(400).json({ msg: "Horario ocupado" });
    }

    // 5️⃣ Verificar que el tipo de turno exista
    const tipo = await TipoTurno.findById(tipoTurno);
    if (!tipo) {
      return res.status(404).json({ msg: "Tipo de turno no encontrado" });
    }

    // 6️⃣ Crear turno
    const turno = new Turno({
      cliente: clienteDoc._id,
      tipoTurno,
      fechaHora: fecha
    });

    await turno.save();

    // 7️⃣ Devolver turno con referencias pobladas
    const turnoPopulado = await Turno.findById(turno._id)
      .populate("cliente")
      .populate("tipoTurno");

    res.status(201).json(turnoPopulado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear turno" });
  }
};

export const obtenerTurnos = async (req, res) => {
  try {
    // 1️⃣ Buscar todos los turnos en la base y poblar las referencias
    const turnos = await Turno.find().populate("cliente tipoTurno");

    // 2️⃣ Crear un nuevo array con los turnos formateados
    const turnosFormateados = turnos.map(turno => {
      // Convertir la fecha a formato legible
      const fechaISO = turno.fechaHora.toISOString(); // UTC
      const fechaFormateada = fechaISO.slice(0, 16).replace("T", " "); // "2025-10-19 18:30"

      return {
        ...turno._doc,        // Copiar los datos base del documento
        fechaHora: fechaFormateada // Reemplazar el campo fechaHora con formato string
      };
    });

    // 3️⃣ Enviar respuesta al frontend
    res.json(turnosFormateados);
  } catch (error) {
    // 4️⃣ Capturar cualquier error y responder con código 500
    console.error("Error en obtenerTurnos:", error);
    res.status(500).json({ error: "Error al obtener turnos" });
  }
};

export const eliminarTurno = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Validar ID
    if (!id) return res.status(400).json({ msg: "Falta el ID del turno" });

    // 2️⃣ Buscar y eliminar
    const turnoEliminado = await Turno.findByIdAndDelete(id);

    if (!turnoEliminado) {
      return res.status(404).json({ msg: "Turno no encontrado" });
    }

    // 3️⃣ Responder con éxito
    res.json({ msg: "Turno eliminado correctamente", turno: turnoEliminado });
  } catch (error) {
    console.error("Error al eliminar turno:", error);
    res.status(500).json({ error: "Error al eliminar turno" });
  }
};


