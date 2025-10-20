export function SelectField({ label, name, value, onChange, options, required }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      >
        {options.map(opt => (
          <option key={opt._id || opt.value} value={opt._id || opt.value}>
            {opt.nombre || opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
