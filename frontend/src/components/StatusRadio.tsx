import classNames from "classnames";

interface IRadioProps {
  name: string;
  value: string;
  children: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLInputElement>;
  active?: boolean;
  color?: string;
}
export default function StatusRadio({
  name,
  value,
  children,
  onClick,
  active,
  color
}: IRadioProps) {
  return (
    <div className="inline-block select-none">
      <label
        htmlFor={value}
        className={classNames(
          "inline-flex cursor-pointer items-center gap-x-1 rounded-9 px-2 py-1 transition-colors ease-out-cubic",
          active ? "bg-grey-dark" : ""
        )}
      >
        <div className={classNames("h-4 w-4 rounded-full", color ? color : "bg-white")}></div>
        <span className="text-xl font-medium">{children}</span>
      </label>
      <input
        type="radio"
        name={name}
        id={value}
        value={value}
        className="appearance-none"
        onClick={onClick}
      />
    </div>
  );
}
