import Link from "next/link";
import getImage from "../utils/getImage";

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
  limitations
}) {
  const iconImg = getImage({ icon, id, type: "icon" });

  return (
    <Link href={`/form/${id}`}>
      <a
        className="flex rounded-40 bg-black-lighter h-36 w-36 overflow-clip transition-all ease-out-cubic hover:rounded-14 hover:-translate-y-1"
        title={title}
      >
        <img src={iconImg} alt={`${title}'s thumbnail`} />
      </a>
    </Link>
  );
}
