export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
