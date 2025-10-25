import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import esLocale from "@fullcalendar/core/locales/es";
import { API_URL } from "../api/fetch.js"; // <-- importar la URL del backend

export function FullCalendarWrapper({ turnos, onEliminarTurno }) {
  const eventos = turnos.map((turno) => ({
    id: turno._id,
    title: `- ${turno.cliente?.nombre || "Sin nombre"} - ${turno.tipoTurno?.nombre || "Sin tipo"
      }`,
    start: turno.fechaHora,
    backgroundColor: "#3b82f6",
  }));

  const today = new Date().toISOString().split("T")[0];

  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridDay"
      initialDate={today}
      events={eventos}
      locale={esLocale}
      height="auto"
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridWeek,dayGridDay",
      }}
      buttonText={{
        today: "Hoy",
        week: "Semana",
        day: "Día",
      }}
      dayCellDidMount={(info) => {
        info.el.addEventListener("click", () => {
          info.view.calendar.changeView(
            "dayGridDay",
            info.date.toISOString().split("T")[0]
          );
        });
      }}
      eventContent={(info) => {
        const isWeekView = info.view.type === "dayGridWeek";
        const isDayView = info.view.type === "dayGridDay";

        const hora = info.event.start.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        switch (true) {
          case isWeekView:
            return (
              <div className="flex items-center px-1 box-border overflow-hidden w-full">
                <span className="truncate text-sm">
                  <strong>{hora}</strong> {info.event.title}
                </span>
              </div>
            );

          case isDayView:
            return (
              <div className="flex items-center px-1 box-border overflow-hidden w-full">
                <span className="truncate text-sm">
                  <strong>{hora}</strong> {info.event.title}
                </span>
                <span
                  className="ml-auto cursor-pointer text-red-600 hover:text-red-800 flex-shrink-0"
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (
                      window.confirm(
                        `¿Eliminar turno de ${info.event.title} a las ${hora}?`
                      )
                    ) {
                      try {
                        const response = await fetch(
                          `${API_URL}/api/turnos/${info.event.id}`, // <-- usar API_URL
                          {
                            method: "DELETE",
                          }
                        );

                        if (!response.ok) {
                          const errData = await response.json();
                          alert(errData.msg || "Error al eliminar turno");
                          return;
                        }

                        const data = await response.json();
                        info.event.remove(); // ✅ quita el evento del calendario
                        if (onEliminarTurno) onEliminarTurno(info.event.id); // opcional: actualizar estado externo
                        alert(data.msg || "Turno eliminado correctamente");
                      } catch (error) {
                        console.error("Error al eliminar turno:", error);
                        alert("Error de conexión al eliminar turno");
                      }
                    }
                  }}
                >
                  🗑️
                </span>
              </div>
            );

          default:
            return <div>{info.event.title}</div>;
        }
      }}
    />
  );
}
