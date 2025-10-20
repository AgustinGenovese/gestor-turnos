import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import esLocale from "@fullcalendar/core/locales/es";

export function FullCalendarWrapper({ turnos }) {
  const eventos = turnos.map((turno) => ({
    title: `- ${turno.cliente?.nombre || "Sin nombre"} - ${turno.tipoTurno?.nombre || "Sin tipo"}`,
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
        right: "dayGridMonth,dayGridWeek,dayGridDay",
      }}
      buttonText={{
        today: "Hoy",
        month: "Mes",
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
        const isDayView = info.view.type === "dayGridDay";

        // Formateamos la hora del evento
        const hora = info.event.start.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <div className="flex items-center px-1 box-border overflow-hidden w-full">
            <span className="truncate text-sm">
              <strong>{hora}</strong> {info.event.title}
            </span>
            {isDayView && (
              <span
                className="ml-auto cursor-pointer text-red-600 hover:text-red-800 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`¿Eliminar turno de ${info.event.title}?`)) {
                    info.event.remove();
                    // fetch/delete al backend si querés persistencia
                  }
                }}
              >
                🗑️
              </span>
            )}
          </div>
        );
      }}
    />
  );
}
