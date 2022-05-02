import classNames from "classnames";

interface IRadioProps {
  name: string;
  value: string;
  children: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLInputElement>;

  // onClick: (event: ChangeEvent<HTMLInputElement>) => void;
  active?: boolean;
  color?: string;
}
export default function Radio({ name, value, children, onClick, active, color }: IRadioProps) {
  return (
    <div className="inline-block select-none">
      <label
        htmlFor={value}
        className={classNames(
          "inline-flex items-center gap-x-1 px-2 py-1 rounded-9 transition-colors ease-out-cubic cursor-pointer",
          active ? "bg-grey-dark" : ""
        )}
      >
        <div className={classNames("w-4 h-4 rounded-full", color ? color : "bg-white")}></div>
        <span className="font-medium text-xl">{children}</span>
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
