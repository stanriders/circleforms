import classNames from 'classnames'
import Link from 'next/link'

export default function FormThumbnail({
  id,
  author_id,
  title,
  description,
  publish_time,
  accessibility,
  limitations,
  children
}) {
  return (
    <Link href="#">
      <a
        className={classNames(
          "flex justify-center items-center bg-pink rounded-20 h-40 transition-transform ease-out-cubic hover:-translate-y-1",
          children ? '' : 'bg-opacity-10'
        )}
        title={title}>
        {children}
      </a>
    </Link>
  )
}