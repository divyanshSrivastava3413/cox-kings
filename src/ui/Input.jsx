export function Input({ value, onChange, ...props }) {
    return (
      <input
        className="border border-gray-300 p-2 rounded-md w-full"
        value={value}
        onChange={onChange}
        {...props}
      />
    );
  }
  