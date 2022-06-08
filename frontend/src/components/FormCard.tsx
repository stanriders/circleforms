import { memo, useMemo, useRef } from "react";
import Link from "next/link";

import { PostWithQuestionsContract } from "../../openapi";
import getImage from "../utils/getImage";

interface IFormCard
  extends Pick<PostWithQuestionsContract, "id" | "icon" | "title" | "published" | "excerpt"> {
  previewIcon?: string;
}
const FormCard = ({ id, icon, title, published, excerpt, previewIcon }: IFormCard) => {
  const iconImg = getImage({ type: "icon", id });
  const imgRef = useRef<HTMLImageElement>(null);

  const previewSrc = useMemo(() => {
    return previewIcon;
  }, [previewIcon]);

  return (
    <Link href={published ? `/form/${id}` : `/dashboard/${id}`}>
      <a
        className="flex justify-start items-center bg-black-lighter rounded-9 h-[88px] transition-transform ease-out-cubic hover:scale-[1.05] select-none pl-[9px] fix-blurry-scale"
        title={title || ""}
      >
        <div className="flex flex-row gap-5 items-center ">
          <img
            ref={imgRef}
            className="object-contain h-[70px] w-[70px] rounded-9"
            src={previewIcon ? previewSrc : iconImg}
            alt={title || ""}
            onLoad={() => URL.revokeObjectURL(imgRef.current?.src!)}
          />
          <div className="flex flex-col">
            <h2 className="text-lg font-bold">{title}</h2>
            <p className="text-xs font-medium text-grey">{excerpt}</p>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default memo(FormCard);
