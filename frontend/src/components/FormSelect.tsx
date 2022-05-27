import React from "react";
import { Controller } from "react-hook-form";

const FormSelect = () => {
  return (
    <Controller
      name="select"
      control={control}
      render={({ field }) => (
        <Select
          {...field}
          options={[
            { value: "chocolate", label: "Chocolate" },
            { value: "strawberry", label: "Strawberry" },
            { value: "vanilla", label: "Vanilla" }
          ]}
        />
      )}
    />
  );
};

export default FormSelect;
