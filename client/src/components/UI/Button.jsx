export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`
        bg-[#449cfc] 
        hover:bg-[#3c97fa] 
        active:bg-[#4494fa] 
        text-white 
        font-medium 
        py-2 
        px-6
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

