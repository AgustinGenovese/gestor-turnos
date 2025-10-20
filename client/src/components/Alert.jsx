export function Alert({ message, type = "error" }) {
  const colors = {
    error: "text-red-700 bg-red-100 border-red-300",
    success: "text-green-700 bg-green-100 border-green-300"
  };
  return (
    <div className={`mb-4 p-2 text-sm border rounded ${colors[type]}`}>
      {message}
    </div>
  );
}
