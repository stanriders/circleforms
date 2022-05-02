interface IRadioProps {
  value: "rank" | "date";
  name: string;
  label: string;
}

export default function InputRadio({ value, name, label }: IRadioProps) {
  return (
    <label className="text-2xl flex items-baseline gap-x-2 cursor-pointer">
      <input className="radio" type="radio" name={name} value={value} />
      {label}
    </label>
  );
}
