export function Table({ children }) {
  return <table className="min-w-full divide-y divide-gray-200">{children}</table>;
}

export function TableHeader({ children }) {
  return <thead className="bg-gray-50">{children}</thead>;
}

export function TableBody({ children }) {
  return <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>;
}

export function TableRow({ children, ...props }) {
  return <tr className="hover:bg-gray-50" {...props}>{children}</tr>;
}

export function TableCell({ children, className }) {
  return <td className={`px-6 py-4 text-sm text-gray-500 ${className || ""}`}>{children}</td>;
}

export function TableHead({ children }) {
  return <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{children}</th>;
}
