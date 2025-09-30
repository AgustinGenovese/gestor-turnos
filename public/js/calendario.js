document.addEventListener("DOMContentLoaded", async function() {
  const calendarioDiv = document.getElementById("calendar");

  // Inicializar FullCalendar
  const calendar = new FullCalendar.Calendar(calendarioDiv, {
    initialView: 'dayGridMonth',
    locale: "es",
    events: async function(fetchInfo, successCallback) {
      // Traer turnos desde backend
      const res = await fetch("/api/turnos");
      const data = await res.json();

      const eventos = data.map(turno => ({
        title: `${turno.cliente.nombre} - ${turno.tipoTurno.nombre}`,
        start: turno.fechaHora,
        backgroundColor: turno.estado === "cobrado" ? "green" : turno.estado === "pendiente" ? "blue" : "red"
      }));

      successCallback(eventos);
    }
  });

  calendar.render();

  // Llenar select de tipos de turno
  const selectTipo = document.querySelector("select[name='tipoTurno']");
  const resTipos = await fetch("/api/tiposTurno");
  const tipos = await resTipos.json();
  console.log(tipos)
  tipos.forEach(tipo => {
    const opt = document.createElement("option");
    opt.value = tipo._id;
    opt.textContent = `${tipo.nombre} (${tipo.duracion} min - $${tipo.precioBase})`;
    selectTipo.appendChild(opt);
  });

  // Manejar envío de formulario
  const form = document.getElementById("formTurno");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {
      cliente: {
        nombre: formData.get("nombre"),
        email: formData.get("email")
      },
      tipoTurno: formData.get("tipoTurno"),
      fechaHora: formData.get("fechaHora")
    };

    // Crear turno en backend
    const res = await fetch("api/turnos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const resultado = await res.json();
    if (res.ok) {
      alert("Turno creado correctamente");
      calendar.refetchEvents(); // actualizar calendario
      form.reset();
    } else {
      alert(resultado.msg || "Error al crear turno");
    }
  });
});
