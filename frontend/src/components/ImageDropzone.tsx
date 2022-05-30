import React, { useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import classNames from "classnames";
import { useTranslations } from "next-intl";

import { formatBytes } from "../utils/misc";

import Button from "./Button";

const ONE_MB = 1_000_000;

interface IImageDropzone {
  name: string;
  headingText: string;
  classname?: string;
  fileAcceptCallback: (args: any) => void;
}
const ImageDropzone = ({ name, headingText, classname, fileAcceptCallback }: IImageDropzone) => {
  const t = useTranslations("global.inputs");
  const [file, setFile] = useState<File>();

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => URL.revokeObjectURL(file?.name as string);
  }, [file?.name]);

  function filesizeValidator(file: { size: number }) {
    if (file.size > ONE_MB) {
      return {
        code: "filesize-too-large",
        message: `File size for ${name} must be lower than 1MB`
      };
    }
    return null;
  }

  const onDrop = (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    setFile(acceptedFiles[0]);
    fileAcceptCallback({
      [name]: acceptedFiles[0]
    });
    if (rejectedFiles.length > 0) {
      fileAcceptCallback({
        [name]: null
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"]
    },
    validator: filesizeValidator,
    maxFiles: 0,
    multiple: false,
    onDrop: onDrop
  });

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    // FIXME delete any, after this gets merged
    // https://github.com/react-dropzone/react-dropzone/pull/1178
    // https://github.com/react-dropzone/react-dropzone/issues/1176
    <li key={(file as any).path}>
      {(file as any).path} - {formatBytes(file.size)}
      <ul>
        {errors.map((e) => (
          <li className="text-pink" key={e.code}>
            {e.message}
          </li>
        ))}
      </ul>
    </li>
  ));

  return (
    <div
      className={classNames("flex flex-col text-center w-full h-full cursor-pointer", classname)}
      {...getRootProps()}
    >
      <p className="font-medium text-3xl">{headingText}</p>
      <div
        className={classNames(
          "flex flex-col items-center justify-center bg-black-lighter h-full w-full rounded-20 border-4 border-dashed border-grey-border mt-1 py-10 transition hover:brightness-110 focus:brightness-150",
          isDragActive ? "brightness-150" : ""
        )}
      >
        {(file && (
          <div>
            <img
              className="h-56 object-contain"
              src={URL.createObjectURL(file)}
              alt={file.name}
              key={file.name}
              onLoad={() => {
                URL.revokeObjectURL(file.name);
              }}
            />
          </div>
        )) || (
          <>
            <p className="font-semibold text-xl mb-1 select-none">{t("file.dragImageHere")}</p>
            <p className="font-medium text-xs text-white text-opacity-20 select-none">
              {t("file.orPressButton")}
            </p>
            <Button theme="secondary" classname="my-2 pointer-events-none">
              {t("file.chooseFile")}
            </Button>
          </>
        )}
        <input {...getInputProps()} type="file" className="hidden" name={name} />
      </div>
      <ul>{fileRejectionItems}</ul>
    </div>
  );
};

export default ImageDropzone;
