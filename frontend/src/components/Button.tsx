import { MouseEventHandler } from "react";
import classNames from "classnames";
import Link from "next/link";

interface IButton {
  href?: string;
  children: React.ReactNode;
  theme?: string;
  large?: boolean;
  rounded?: boolean;
  active?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  classname?: string;
}

const Button = ({
  href,
  children,
  theme = "primary",
  large,
  rounded,
  active,
  onClick,
  classname,
  ...props
}: IButton) => {
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
};
export default Button;
