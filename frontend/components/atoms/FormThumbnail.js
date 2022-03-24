import Link from 'next/link'

export default function FormThumbnail({
  id,
  author_id,
  title,
  description,
  publish_time,
  accessibility,
  limitations,
}) {
  return (
    <Link href="#">
      <a
        className="flex rounded-40 bg-black-lighter h-36 w-36 overflow-clip transition-all ease-out-cubic hover:rounded-14 hover:-translate-y-1"
        title={title}>
        <img src="/images/form-entry-test-thumbnail.png" alt="form label todo" />
      </a>
    </Link>
  )
}