import Link from "next/link";

import getImage from "../utils/getImage";

interface IFormThumbnail {
  id: string;
  icon: string;
  title: string;
}
export default function FormThumbnail({ id, icon, title }: IFormThumbnail) {
  const iconImg = getImage({ id, icon, type: "icon" });

  return (
    <Link href={`/form/${id}`}>
      <a
        className="flex h-36 w-36 text-clip rounded-40 bg-black-lighter transition-all ease-out-cubic hover:-translate-y-1 hover:rounded-14"
        title={title || ""}
      >
        <img src={iconImg} alt={`${title}'s thumbnail`} />
      </a>
    </Link>
  );
}
