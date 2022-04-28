import classNames from "classnames";
import { useTranslations } from "next-intl";
import React, { Fragment, useRef, useState } from "react";
import Button from "./Button";

interface InputFileProps {
  label: string;
  name: string;
  value: File[];
  classname?: string;
  onChange: (() => void) | ((files: File[]) => void);
}

function noop() {}

export default function InputFile({
  label,
  name,
  value,
  classname,
  onChange = noop
}: InputFileProps) {
  const t = useTranslations("global.inputs");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDragOver(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }

  function handleDragExit(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }

  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    e.stopPropagation();

    const { files } = e.dataTransfer;

    if (files && files.length > 0) {
      onChange([...files]);
    }

    setDragOver(false);
  }

  return (
    <label
      htmlFor={name}
      className={classNames("flex flex-col text-center w-full h-full cursor-pointer", classname)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragExit}
      onDrop={handleDrop}
    >
      <p className="font-medium text-3xl">{label}</p>
      <div
        className={classNames(
          "flex flex-col items-center justify-center bg-black-lighter h-full w-full rounded-20 border-4 border-dashed border-grey-border mt-1 py-10 transition hover:brightness-110 focus:brightness-150",
          dragOver ? "brightness-150" : ""
        )}
      >
        {(Boolean(value.length) && (
          <div>
            {value.map((file) => (
              <img
                className="h-56"
                src={URL.createObjectURL(file)}
                alt={file.name}
                key={file.name}
              />
            ))}
          </div>
        )) || (
          <Fragment>
            <p className="font-semibold text-xl mb-1 select-none">{t("file.dragImageHere")}</p>
            <p className="font-medium text-xs text-white text-opacity-20 select-none">
              {t("file.orPressButton")}
            </p>

            <Button onClick={() => inputRef?.current?.click()} theme="secondary" classname="my-2">
              {t("file.chooseFile")}
            </Button>
          </Fragment>
        )}
        <input
          ref={inputRef}
          id={name}
          name={name}
          onChange={(e) => {
            onChange([...e.target.files!]);
          }}
          type="file"
          className="hidden"
          accept="image/png, image/jpeg"
        />
      </div>
    </label>
  );
}
