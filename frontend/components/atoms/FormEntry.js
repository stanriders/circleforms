import Link from 'next/link'
import * as timeago from 'timeago.js';

export default function FormEntry({
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
  const bannerImg = banner ? `https://assets.circleforms.net/${id}/${banner}` : `/images/form-entry-test.jpg`

  return (
    <Link href={`/form/${id}`}>
      <a className="flex rounded-5 overflow-clip bg-black-light z-0 transform transition-transform ease-out-cubic hover:scale-99 hover:z-10">
        <div
          className="flex-1 bg-cover"
          style={{
            backgroundImage: `
              linear-gradient(270deg, #131313 2.39%, rgba(17, 17, 17, 0) 98.16%),
              url('${bannerImg}')
            `
          }}
        />
        <div className="flex-1 flex justify-between py-5 pr-5">
          <div>
            <h3 className="text-m font-bold truncate max-w-sm">
              { title }
            </h3>
            <p className="text-xs text-white text-opacity-50 -mt-1 truncate max-w-sm">
              { description }
            </p>
          </div>
          <div className="flex items-center">
            <div className="flex flex-col text-xs mr-2 text-right">
              <span className="font-semibold">posted by <span className="font-bold">{author_id}</span></span>
              <span className="text-green">
                {timeago.format(publish_time)}
              </span>
            </div>
            <img
              className="h-10 w-10 rounded-full"
              src={`https://s.ppy.sh/a/${author_id}`}
              alt="Profile user {name}" />
          </div>
        </div>
      </a>
    </Link>
  )
}