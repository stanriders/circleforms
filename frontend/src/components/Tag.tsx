import classNames from "classnames";

interface ITagProps {
  label: string;
  theme: string;
  small?: boolean;
}
export default function Tag({ label, theme = "success", small }: ITagProps) {
  return (
    <div
      className={classNames(
        "",
        !small ? "rounded-7 px-5 py-1 text-2xl font-medium" : "",
        theme === "success" ? "bg-green text-green-dark" : "",
        theme === "stale" ? "bg-black-light text-white text-opacity-40" : ""
      )}
    >
      <span>{label}</span>
    </div>
  );
}
