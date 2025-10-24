export function ButtonCliente({ children, className = "", ...props }) {
    return (
        <button
            className={`
        bg-[#c2a255]
        hover:bg-[#ccac5c]
        active:bg-[#ccac5c]
        text-white
        font-medium
        py-2
        px-6
        rounded-md
        shadow-sm
        transition-colorsF
        ${className}F
      `}
            {...props}
        >
            {children}
        </button>
    );
}