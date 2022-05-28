import React from "react";
import { Select } from "@mantine/core";

const MantineSelect = ({ data, label, inputProps, placeholder, value, setValue }) => {
  return (
    <Select
      value={value}
      onChange={setValue}
      label={label}
      placeholder={placeholder}
      data={data}
      {...inputProps}
    />
  );
};

export default MantineSelect;
