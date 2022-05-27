import { TabPanel } from "@reach/tabs";
import { useTranslations } from "next-intl";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { MdAddCircleOutline } from "react-icons/md";
import FieldArray from "./FieldArray";

const defaultValues = {
  test: [
    {
      name: "useFieldArray1",
      nestedArray: [{ field1: "field1", field2: "field2" }]
    }
  ]
};

const QuestionsTab = () => {
  const t = useTranslations();

  const { control, register, handleSubmit, getValues, errors, reset, setValue } = useForm({
    defaultValues
  });
  const onSubmit = (data) => console.log("data", data);

  return (
    <div className="">
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-4 rounded-35 bg-black-lighter pt-5 pb-8 px-14 relative overflow-clip">
          <div className="absolute left-0 top-0 bg-pink h-2 w-full" />
        </div>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <FieldArray {...{ control, register, defaultValues, getValues, setValue, errors }} />
          {/* <button type="button" onClick={() => reset(defaultValues)}>
            Reset
          </button> */}
          <input type="submit" />
        </form>
      </div>
    </div>
  );
};

export default QuestionsTab;
