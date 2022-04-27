function noop() {}

export default function InputRadio({ value, name, label, onChange = noop }) {
  return (
    <label className="text-2xl flex items-baseline gap-x-2 cursor-pointer">
      <input
        className="radio"
        onChange={(e) => onChange(e.target.value)}
        type="radio"
        name={name}
        value={value}
      />
      {label}
    </label>
  )
}
