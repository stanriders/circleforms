import Link from "next/link";

import { PostWithQuestionsContract } from "../../openapi";
import getImage from "../utils/getImage";

export default function FormThumbnail({ id, icon, title }: PostWithQuestionsContract) {
  const iconImg = getImage({ icon, id, type: "icon" });

  return (
    <Link href={`/form/${id}`}>
      <a
        className="flex rounded-40 bg-black-lighter h-36 w-36 overflow-clip transition-all ease-out-cubic hover:rounded-14 hover:-translate-y-1"
        title={title || ""}
      >
        <img src={iconImg} alt={`${title}'s thumbnail`} />
      </a>
    </Link>
  );
}
