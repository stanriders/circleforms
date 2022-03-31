import classNames from 'classnames'
import Link from 'next/link'
import getImage from '../../utils/getImage'

export default function FormThumbnail({
  id,
  author_id,
  is_active,
  icon,
  banner,
  title,
  description,
  publish_time,
  accessibility,
  limitations,
}) {
  if (!id) {
    return (
      <div
        className="flex justify-center items-center bg-pink rounded-20 h-40 transition-transform ease-out-cubic hover:-translate-y-1 bg-opacity-10">
      </div>
    )
  }

  const iconImg = getImage({ icon, type: 'icon', id })

  return (
    <Link href={`/form/${id}`}>
      <a
        className="flex justify-center items-center bg-pink rounded-20 h-40 transition-transform ease-out-cubic hover:-translate-y-1 select-none"
        title={title}>
        <img src={iconImg} alt={title} />
      </a>
    </Link>
  )
}