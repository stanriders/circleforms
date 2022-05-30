import React, { ChangeEventHandler, Dispatch, InputHTMLAttributes, SetStateAction } from "react";
import { useEffect, useRef, useState } from "react";
import {
  MdEdit,
  MdFormatBold,
  MdFormatItalic,
  MdImage,
  MdLink,
  MdPreview,
  MdStrikethroughS
} from "react-icons/md";
import autosize from "autosize";
import classNames from "classnames";
import { useTranslations } from "next-intl";

import bbcode from "../libs/bbcode";
import { withEvent } from "../utils/misc";

const TOOLBAR_ICONS = {
  b: MdFormatBold,
  i: MdFormatItalic,
  s: MdStrikethroughS,
  url: MdLink,
  img: MdImage
};

type ToolbarIcon = keyof typeof TOOLBAR_ICONS;
function insertAtCaret(input: HTMLTextAreaElement, type: ToolbarIcon) {
  const selected = input.value.slice(input.selectionStart, input.selectionEnd);

  let rangeText = "";

  switch (type) {
    case "b":
    case "i":
    case "s":
    case "url":
    case "img":
      rangeText = `[${type}]${selected}[/${type}]`;
      break;

    default:
      break;
  }

  input.setRangeText(rangeText);
  input.focus();
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

interface IWysiwyg {
  value: string;
  placeholder: string;
  onTextAreaChange: ChangeEventHandler<HTMLTextAreaElement> | Dispatch<SetStateAction<string>>;
  toolbarItems?: ToolbarIcon[];
  inputProps?: InputHTMLAttributes<HTMLTextAreaElement>;
  onBlur: React.FocusEventHandler<HTMLTextAreaElement>;
  name: string;
}
const Wysiwyg = ({
  value = "",
  placeholder = "Placeholder",
  onTextAreaChange,
  toolbarItems = ["b", "i", "s", "url", "img"],
  inputProps,
  onBlur,
  name
}: IWysiwyg) => {
  const textarea = useRef<HTMLTextAreaElement>(null);
  const t = useTranslations("global.inputs.wysiwyg");
  const [preview, setPreview] = useState(bbcode(value));
  const [hasPreview, setHasPreview] = useState(false);

  useEffect(() => {
    // @ts-ignore
    autosize(textarea.current);
  }, []);

  useEffect(() => {
    if (hasPreview) {
      setPreview(bbcode(value));
    }
  }, [hasPreview, value]);

  return (
    <div className={`relative overflow-clip`}>
      <button
        type="button"
        onClick={() => setHasPreview(!hasPreview)}
        className="button--icon mb-2"
        title={hasPreview ? t("write") : t("preview")}
      >
        <span className="sr-only">{hasPreview ? t("write") : t("preview")}</span>
        {hasPreview ? <MdEdit className="w-8 h-8" /> : <MdPreview className="w-8 h-8" />}
      </button>
      {(!hasPreview && (
        <textarea
          ref={textarea}
          value={value}
          onChange={withEvent(onTextAreaChange)}
          placeholder={placeholder}
          className={`w-full bg-black-lightest border-b-2 border-white pl-3 pt-2 text-2xl font-medium`}
          onBlur={onBlur}
          name={name}
          {...inputProps}
        ></textarea>
      )) || (
        <div
          className="w-full bg-black-lightest border-b-2 border-white p-4"
          dangerouslySetInnerHTML={{ __html: preview }}
        ></div>
      )}

      <div
        className={classNames(
          "absolute -right-4 bottom-2 inline-flex items-center pl-6 pr-5 bg-white rounded-tl-35 text-black transition-opacity ease-out-cubic",
          hasPreview ? "opacity-0" : "opacity-100"
        )}
      >
        {toolbarItems.map((type, i) => (
          <ToolbarItem
            key={`toolbar--item--${type}-${i}`}
            type={type}
            // @ts-ignore
            onClick={() => insertAtCaret(textarea.current, type)}
          />
        ))}
      </div>
    </div>
  );
};

interface IToolbarItem {
  type: keyof typeof TOOLBAR_ICONS;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}
function ToolbarItem({ type, onClick }: IToolbarItem) {
  const Icon = TOOLBAR_ICONS[type];

  return (
    <button type="button" onClick={onClick} className="button--icon">
      <Icon className="w-8 h-8" />
    </button>
  );
}

export default Wysiwyg;
