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
        className="flex w-36 h-36 text-clip bg-black-lighter rounded-40 hover:rounded-14 transition-all hover:-translate-y-1 ease-out-cubic"
        title={title || ""}
      >
        <img src={iconImg} alt={`${title}'s thumbnail`} />
      </a>
    </Link>
  );
}
