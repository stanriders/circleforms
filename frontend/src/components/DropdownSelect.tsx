import React from "react";
import { Select, SelectProps } from "@mantine/core";

const DropdownSelect = React.forwardRef((props: SelectProps) => {
  return (
    <Select
      radius={"lg"}
      size={"md"}
      styles={{
        root: { color: "#eee", fontSize: "1.5rem", maxWidth: "fit-content" },
        dropdown: { backgroundColor: "black", color: "#eeeeee" },
        item: { backgroundColor: "black", color: "#eeeeee" },
        input: {
          backgroundColor: "#1a1a1a",
          color: "#eeeeee",
          borderWidth: "2px",
          fontWeight: "bold"
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
