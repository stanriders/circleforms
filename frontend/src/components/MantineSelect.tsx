import React from "react";
import { Select } from "@mantine/core";

interface IMantineSelect {
  data: any;
  label: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  placeholder?: string;
  value: string | number | readonly string[];
  setValue: React.ChangeEventHandler<HTMLInputElement>;
}

const MantineSelect = ({
  data,
  label,
  inputProps,
  placeholder,
  value,
  setValue
}: IMantineSelect) => {
  return (
    <Select
      value={value}
      onChange={setValue}
      label={label}
      aria-label={label}
      placeholder={placeholder}
      data={data}
      {...inputProps}
    />
  );
};

export default MantineSelect;
