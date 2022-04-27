import classNames from "classnames";
import Link from "next/link";

export default function Button({
  href,
  children,
  theme = "primary",
  large,
  rounded,
  active,
  onClick,
  classname,
  ...props
}) {
  const classnames = classNames(
    "button",
    theme,
    classname,
    large ? "button--large" : "",
    rounded ? "button--rounded" : "",
    active ? "active" : ""
  );

  if (href) {
    return (
      <Link href={href} passHref>
        <a className={classnames} {...props}>
          {children}
        </a>
      </Link>
    );
  }

  return (
    <button {...props} className={classnames} onClick={onClick}>
      {children}
    </button>
  );
}
