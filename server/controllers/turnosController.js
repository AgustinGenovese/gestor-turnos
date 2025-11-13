import Turno from "../models/turno.js";
import TipoTurno from "../models/tipoTurno.js";
import Cliente from "../models/cliente.js";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

import { Resend } from "resend";

dayjs.extend(utc);
dayjs.extend(timezone);

const ZONA_ARG = "America/Argentina/Buenos_Aires"; // zona horaria del negocio

const resend = new Resend(process.env.RESEND_API_KEY);

export const obtenerFranjasDisponibles = async (req, res) => {
  try {
    const { fecha, tipoTurno: tipoTurnoId } = req.query;
    if (!fecha || !tipoTurnoId)
      return res.status(400).json({ msg: "Faltan parámetros" });

    const tipoTurno = await TipoTurno.findById(tipoTurnoId);
    if (!tipoTurno)
      return res.status(404).json({ msg: "Tipo de turno no encontrado" });

    const duracion = tipoTurno.duracion; // en minutos
    const apertura = 10;
    const cierre = 20;

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

    const inicioLaboral = inicioDiaLocal.hour(apertura).minute(0).second(0);
    const finLaboral = inicioDiaLocal.hour(cierre).minute(0).second(0);

    const franjasDisponibles = [];

    // 🔄 Analizamos hora por hora (franjas de 1h)
    for (let h = apertura; h < cierre; h++) {
      const franjaInicio = inicioDiaLocal.hour(h).minute(0).second(0);
      const franjaFin = franjaInicio.add(1, "hour");

      // 🔹 Hora actual en Argentina
      const ahora = dayjs().tz(ZONA_ARG);

      // 🔹 Si la fecha es hoy y la franja ya pasó, saltar
      const esHoy = franjaInicio.isSame(ahora, "day");
      if (esHoy && franjaFin.isBefore(ahora)) {
        continue; // ⛔ saltar esta franja completa
      }

      let hayBloqueLibre = false;
      let cursor = franjaInicio;

      // 🔁 Recorremos dentro de la franja, permitiendo que el bloque cruce al siguiente tramo
      while (cursor.valueOf() + duracion * 60000 <= finLaboral.valueOf()) {
        const bloqueInicioUTC = cursor.utc().toDate();
        const bloqueFinUTC = cursor.add(duracion, "minute").utc().toDate();

        // 🧠 Si el bloque cae al menos parcialmente dentro de la franja actual
        const tocaFranja =
          cursor.isBefore(franjaFin) &&
          cursor.add(duracion, "minute").isAfter(franjaInicio);

        if (tocaFranja) {
          const choque = turnosOcupados.some(
            (t) => bloqueInicioUTC < t.fin && bloqueFinUTC > t.fechaHora
          );

          if (!choque) {
            hayBloqueLibre = true;
            break; // ya sabemos que hay disponibilidad en esta franja
          }
        }

        cursor = cursor.add(5, "minute"); // avanza 5 min
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

export const obtenerHorariosPorFranja = async (req, res) => {
  try {
    const { fecha, franja, tipoTurno: tipoTurnoId, ultima } = req.query;

    if (!fecha || !franja || !tipoTurnoId)
      return res.status(400).json({ msg: "Faltan parámetros" });

    const tipoTurno = await TipoTurno.findById(tipoTurnoId);
    if (!tipoTurno)
      return res.status(404).json({ msg: "Tipo de turno no encontrado" });

    const duracion = tipoTurno.duracion; // minutos
    const [inicioStr, finStr] = franja.split("-");

    const franjaInicio = dayjs.tz(`${fecha} ${inicioStr}`, ZONA_ARG);
    const franjaFin = dayjs.tz(`${fecha} ${finStr}`, ZONA_ARG);

    const inicioUTC = franjaInicio.utc().toDate();
    const finUTC = franjaFin.utc().toDate();

    // ✅ Usamos franjaFin.add(1, 'hour') ANTES de convertir a Date
    const finUTCConMargen = franjaFin.add(1, "hour").utc().toDate();

    const turnosOcupados = await Turno.find({
      $and: [
        { fechaHora: { $lt: finUTCConMargen } },
        { fin: { $gt: inicioUTC } },
      ],
    });

    const horariosPosibles = [];
    let cursor = franjaInicio.clone();

    while (cursor.isBefore(franjaFin)) {
      const bloqueInicio = cursor.clone();
      const bloqueFin = bloqueInicio.clone().add(duracion, "minute");

      if (ultima === "true" && bloqueFin.isAfter(franjaFin)) break;

      // 🔹 Obtener la hora actual en Argentina
      const ahora = dayjs().tz(ZONA_ARG);

      // 🔹 Evitar horarios pasados si es el mismo día
      const esHoy = bloqueInicio.isSame(ahora, "day");
      if (esHoy && bloqueInicio.isBefore(ahora)) {
        cursor = cursor.add(5, "minute");
        continue; // ⛔ Saltar horarios anteriores a la hora actual
      }

      const choca = turnosOcupados.some((t) => {
        const turnoInicio = dayjs(t.fechaHora);
        const turnoFin = dayjs(t.fin);
        return bloqueInicio.isBefore(turnoFin) && bloqueFin.isAfter(turnoInicio);
      });

      if (!choca) horariosPosibles.push(bloqueInicio.format("HH:mm"));

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

const sendConfirmationEmail = async (to, htmlContent) => {
  try {

    await resend.emails.send({
      from: process.env.FROM_EMAIL, // debe estar verificado en Resend
      to: [to],
      subject: "Confirmación de turno - Sarkirian Barbershop",
      html: htmlContent,
    });
    console.log("Correo enviado a", to);
  } catch (err) {
    console.error("Error enviando correo con Resend:", err);
    if (err.response) console.error("Detalle:", err.response.data);
  }
};

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
    if (!tipo) return res.status(404).json({ msg: "Tipo de turno no encontrado" });

    const duracion = tipo.duracion;
    const fin = dayjs(fecha).add(duracion, "minute").toDate();

    // 🚫 Verificar solapamiento exacto
    const solapa = await Turno.findOne({
      $and: [{ fechaHora: { $lt: fin } }, { fin: { $gt: fecha } }],
    });
    if (solapa) return res.status(400).json({ msg: "Horario ocupado" });

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

    // 📧 Enviar email de confirmación (no bloqueante)
    sendConfirmationEmail(
      clienteDoc.email,
      `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 16px;">
        <h2 style="color: #c2a255;">¡Tu turno fue confirmado!</h2>
        <p>Hola <strong>${clienteDoc.nombre}</strong>,</p>
        <p>Gracias por reservar tu turno en <strong>Sarkirian Barbershop</strong>.</p>
        <p><b>Fecha:</b> ${dayjs(turnoPopulado.fechaHora).tz(ZONA_ARG).format("DD/MM/YYYY")}<br/>
           <b>Hora:</b> ${dayjs(turnoPopulado.fechaHora).tz(ZONA_ARG).format("HH:mm")} hs<br/>
           <b>Servicio:</b> ${turnoPopulado.tipoTurno.nombre}</p>
        <p>Por favor, verificá que tus datos sean correctos. Si necesitás modificar o cancelar tu turno, comunicate con nosotros.</p>
        <br/>
        <p style="font-size: 0.9rem; color: #777;">Sarkirian Barbershop © ${new Date().getFullYear()}</p>
      </div>
      `
    );

    res.status(201).json({
      msg: "Turno creado correctamente",
      turno: turnoPopulado,
    });

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
