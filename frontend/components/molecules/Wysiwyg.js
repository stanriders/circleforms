import { useEffect, useState } from 'react'
import {
  MdFormatBold,
  MdFormatItalic,
  MdStrikethroughS,
  MdLink,
  MdImage
} from 'react-icons/md'
import bbcode from '../../libs/bbcode'

function Wysiwyg({
  value = '',
  placeholder = 'Placeholder',
  onChange,
}) {
  const [preview, setPreview] = useState(bbcode(value))
  const [hasPreview, setHasPreview] = useState(false)

  useEffect(() => {
    if (hasPreview) {
      setPreview(bbcode(value))
    }
  }, [hasPreview])

  return (
    <div className="relative overflow-clip">
      {!hasPreview && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-black-lightest border-b-2 border-white pl-3 pt-2 text-2xl font-medium"></textarea>
      ) || (
        <div className="w-full bg-black-lightest border-b-2 border-white pl-3 pt-2" dangerouslySetInnerHTML={{ __html: preview }}></div>
      )}

      <div className="absolute -right-4 bottom-2 inline-flex items-center pl-6 pr-5 bg-white rounded-tl-35 text-black">
        <button className="button--icon">
          <MdFormatBold className="h-8 w-8"/>
        </button>
        <button className="button--icon">
          <MdFormatItalic className="h-8 w-8" />
        </button>
        <button className="button--icon">
          <MdStrikethroughS className="h-8 w-8" />
        </button>
        <button className="button--icon">
          <MdLink className="h-8 w-8" />
        </button>
        <button className="button--icon">
          <MdImage className="h-8 w-8"/>
        </button>
      </div>
    </div>
  )
}

export default Wysiwyg