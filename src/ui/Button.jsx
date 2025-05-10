export function Button({ children, onClick, variant = "solid", ...props }) {
    const styles =
      variant === "outline"
        ? "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
        : "text-white bg-blue-600 hover:bg-blue-700";
    return (
      <button
        className={`px-4 py-2 rounded-md ${styles}`}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  }
  