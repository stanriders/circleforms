import autosize from "autosize"
import classNames from "classnames"
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"
import {
  MdFormatBold,
  MdFormatItalic,
  MdStrikethroughS,
  MdLink,
  MdImage,
  MdEdit,
  MdPreview,
} from "react-icons/md"
import bbcode from "../libs/bbcode"

/**
 *
 * @param {HTMLTextAreaElement} input
 * @param {string} type
 */
function insertAtCaret(input, type) {
  const selected = input.value.slice(input.selectionStart, input.selectionEnd)

  let rangeText = ""

  switch (type) {
    case "b":
    case "i":
    case "s":
    case "url":
    case "img":
      rangeText = `[${type}]${selected}[/${type}]`
      break

    default:
      break
  }

  input.setRangeText(rangeText)
  input.focus()
  input.dispatchEvent(new Event("input"))
}

function Wysiwyg({
  value = "",
  placeholder = "Placeholder",
  onChange,
  toolbarItems = ["b", "i", "s", "url", "img"],
}) {
  const textarea = useRef()
  const t = useTranslations("global.inputs.wysiwyg")
  const [preview, setPreview] = useState(bbcode(value))
  const [hasPreview, setHasPreview] = useState(false)

  useEffect(() => {
    autosize(textarea.current)
  }, [])

  useEffect(() => {
    if (hasPreview) {
      setPreview(bbcode(value))
    }
  }, [hasPreview])

  return (
    <div className="relative overflow-clip">
      <button
        onClick={() => setHasPreview(!hasPreview)}
        className="button--icon mb-2"
        title={hasPreview ? t("write") : t("preview")}>
        <span className="sr-only">{hasPreview ? t("write") : t("preview")}</span>
        {hasPreview ? <MdEdit className="w-8 h-8" /> : <MdPreview className="w-8 h-8" />}
      </button>
      {(!hasPreview && (
        <textarea
          ref={textarea}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-black-lightest border-b-2 border-white pl-3 pt-2 text-2xl font-medium"></textarea>
      )) || (
        <div
          className="w-full bg-black-lightest border-b-2 border-white p-4"
          dangerouslySetInnerHTML={{ __html: preview }}></div>
      )}

      <div
        className={classNames(
          "absolute -right-4 bottom-2 inline-flex items-center pl-6 pr-5 bg-white rounded-tl-35 text-black transition-opacity ease-out-cubic",
          hasPreview ? "opacity-0" : "opacity-100"
        )}>
        {toolbarItems.map((type, i) => (
          <ToolbarItem
            key={`toolbar--item--${type}-${i}`}
            type={type}
            onClick={() => insertAtCaret(textarea.current, type)}
          />
        ))}
      </div>
    </div>
  )
}

const TOOLBAR_ICONS = {
  b: MdFormatBold,
  i: MdFormatItalic,
  s: MdStrikethroughS,
  url: MdLink,
  img: MdImage,
}

function ToolbarItem({ type, onClick }) {
  const Icon = TOOLBAR_ICONS[type]

  return (
    <button onClick={onClick} className="button--icon">
      <Icon className="w-8 h-8" />
    </button>
  )
}

export default Wysiwyg
