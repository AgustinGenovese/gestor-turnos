export function ButtonCliente({ children, className = "", ...props }) {
    return (
        <button
            className={`
        bg-[#c2a255]
        hover:bg-[#ccac5c]
        active:bg-[#ccac5c]
        text-white
        font-medium
        py-1.5
        px-3
        rounded-md
        shadow-sm
        transition-colors
        ${className}
      `}
            {...props}
        >
            {children}
        </button>
    );
}
