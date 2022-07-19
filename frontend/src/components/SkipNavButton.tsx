import React from "react";

interface ISkipNavButton {
  className?: string;

  children: React.ReactElement;
  /**
   * The css query aiding the selection of the
   * container (main, section etc) we want to scroll to;
   */
  skipTo?: string;
}

const SkipNavButton: React.FC<ISkipNavButton> = (props) => {
  const onClick = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const container: HTMLElement | null = document.querySelector(props.skipTo || "");

    if (container) {
      container.tabIndex = -1;
      container.focus();
      setTimeout(() => container.removeAttribute("tabindex"), 1000);
    }
  };

  return React.cloneElement(props.children, { onClick, className: props.className });
};

SkipNavButton.defaultProps = {
  className: "skip-link",
  skipTo: "main:first-of-type"
};

export default SkipNavButton;
