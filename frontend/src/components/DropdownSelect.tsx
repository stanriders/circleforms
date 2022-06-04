import React from "react";
import { Select, SelectProps } from "@mantine/core";

const DropdownSelect = React.forwardRef<HTMLInputElement, SelectProps>((props, ref) => {
  return (
    <Select
      ref={ref}
      radius={"lg"}
      size={"md"}
      styles={{
        root: { color: "#eee", maxWidth: "fit-content", width: "fit-content" },

        dropdown: { backgroundColor: "black", color: "#eeeeee" },
        item: { backgroundColor: "black", color: "#eeeeee", fontSize: "1.5rem" },
        input: {
          backgroundColor: "#1a1a1a",
          color: "#eeeeee",
          borderWidth: "2px",
          fontWeight: "lighter",
          fontSize: "1.5rem",
          width: "fit-content"
        },
        hovered: { backgroundColor: "#1672d4", color: "#eeeeee" },
        selected: { backgroundColor: "#1a1a1a", color: "#FF66AA" }
      }}
      {...props}
    />
  );
});

DropdownSelect.displayName = "DropdownSelect";

export default DropdownSelect;
