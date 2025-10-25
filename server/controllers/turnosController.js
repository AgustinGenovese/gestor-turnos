import Turno from "../models/turno.js";
import TipoTurno from "../models/tipoTurno.js";
import Cliente from "../models/cliente.js";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

const ZONA_ARG = "America/Argentina/Buenos_Aires"; // zona horaria del negocio

// ==========================
// 1️⃣ FRANJAS HORARIAS DISPONIBLES
// ==========================
export const obtenerFranjasDisponibles = async (req, res) => {
  try {
    const { fecha, tipoTurno: tipoTurnoId } = req.query;
    if (!fecha || !tipoTurnoId)
      return res.status(400).json({ msg: "Faltan parámetros" });

    const tipoTurno = await TipoTurno.findById(tipoTurnoId);
    if (!tipoTurno)
      return res.status(404).json({ msg: "Tipo de turno no encontrado" });

    const duracion = tipoTurno.duracion; // en minutos
    const apertura = 9;
    const cierre = 18;

    const inicioDiaLocal = dayjs.tz(fecha, ZONA_ARG).startOf("day");
    const finDiaLocal = inicioDiaLocal.endOf("day");

    const inicioDiaUTC = inicioDiaLocal.utc().toDate();
    const finDiaUTC = finDiaLocal.utc().toDate();

    // 🔍 Traemos los turnos que puedan afectar el día completo
    const turnosOcupados = await Turno.find({
      $and: [
        { fechaHora: { $lt: finDiaUTC } },
        { fin: { $gt: inicioDiaUTC } },
      ],
    });

    const franjasDisponibles = [];

    for (let h = apertura; h < cierre; h++) {
      const franjaInicio = inicioDiaLocal.hour(h).minute(0).second(0);
      const franjaFin = franjaInicio.add(1, "hour");

      let hayBloqueLibre = false;
      let cursor = franjaInicio;

      while (cursor.valueOf() + duracion * 60000 <= franjaFin.valueOf()) {
        const bloqueInicioUTC = cursor.utc().toDate();
        const bloqueFinUTC = cursor.add(duracion, "minute").utc().toDate();

        // 🧠 Verificamos si el bloque se solapa con algún turno (usando fechaHora y fin)
        const choque = turnosOcupados.some(
          (t) => bloqueInicioUTC < t.fin && bloqueFinUTC > t.fechaHora
        );

        if (!choque) {
          hayBloqueLibre = true;
          break;
        }

        cursor = cursor.add(5, "minute"); // avanza 5 minutos
      }

      if (hayBloqueLibre) {
        franjasDisponibles.push({
          inicio: franjaInicio.format("HH:mm"),
          fin: franjaFin.format("HH:mm"),
        });
      }
    }

    res.json({ franjas: franjasDisponibles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener franjas" });
  }
};

// ==========================
// 2️⃣ HORARIOS DISPONIBLES DENTRO DE UNA FRANJA
// ==========================
export const obtenerHorariosPorFranja = async (req, res) => {
  try {
    const { fecha, franja, tipoTurno: tipoTurnoId } = req.query;
    if (!fecha || !franja || !tipoTurnoId)
      return res.status(400).json({ msg: "Faltan parámetros" });

    const tipoTurno = await TipoTurno.findById(tipoTurnoId);
    if (!tipoTurno)
      return res.status(404).json({ msg: "Tipo de turno no encontrado" });

    const duracion = tipoTurno.duracion; // en minutos
    const [inicioStr, finStr] = franja.split("-");
    const franjaInicio = dayjs.tz(`${fecha} ${inicioStr}`, ZONA_ARG);
    const franjaFin = dayjs.tz(`${fecha} ${finStr}`, ZONA_ARG);

    const inicioUTC = franjaInicio.utc().toDate();
    const finUTC = franjaFin.utc().toDate();

    const turnosOcupados = await Turno.find({
      $and: [
        { fechaHora: { $lt: finUTC } },
        { fin: { $gt: inicioUTC } },
      ],
    });

    const horariosPosibles = [];
    let cursor = franjaInicio;

    while (cursor.isBefore(franjaFin)) {
      const bloqueInicioUTC = cursor.utc().toDate();
      const bloqueFinUTC = cursor.add(duracion, "minute").utc().toDate();

      const choque = turnosOcupados.some(
        (t) => bloqueInicioUTC < t.fin && bloqueFinUTC > t.fechaHora
      );

      if (!choque) {
        horariosPosibles.push(cursor.format("HH:mm"));
      }

      cursor = cursor.add(5, "minute");
    }

    if (horariosPosibles.length === 0)
      return res.json({ msg: "No hay turnos disponibles", horarios: [] });

    res.json({ horarios: horariosPosibles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener horarios" });
  }
};

// ==========================
// 3️⃣ CREAR TURNO
// ==========================
export const crearTurno = async (req, res) => {
  try {
    const { cliente, tipoTurno, fechaHora } = req.body;

    if (!cliente || !tipoTurno || !fechaHora) {
      return res.status(400).json({ msg: "Faltan datos obligatorios" });
    }

    const fecha = dayjs.tz(fechaHora, ZONA_ARG).toDate();
    if (isNaN(fecha.getTime()) || fecha < new Date()) {
      return res.status(400).json({ msg: "Fecha/hora inválida o pasada" });
    }

    // 🧾 Buscar o crear cliente
    let clienteDoc = await Cliente.findOne({ email: cliente.email });
    if (!clienteDoc) {
      clienteDoc = new Cliente(cliente);
      await clienteDoc.save();
    } else {
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

    // 📌 Tipo de turno
    const tipo = await TipoTurno.findById(tipoTurno);
    if (!tipo) {
      return res.status(404).json({ msg: "Tipo de turno no encontrado" });
    }

    const duracion = tipo.duracion;
    const fin = dayjs(fecha).add(duracion, "minute").toDate();

    // 🚫 Verificar solapamiento exacto
    const solapa = await Turno.findOne({
      $and: [{ fechaHora: { $lt: fin } }, { fin: { $gt: fecha } }],
    });

    if (solapa) {
      return res.status(400).json({ msg: "Horario ocupado" });
    }

    // ✅ Crear turno
    const turno = new Turno({
      cliente: clienteDoc._id,
      tipoTurno,
      fechaHora: fecha,
      duracion,
      fin,
    });

    await turno.save();

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


