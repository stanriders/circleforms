import { memo, useMemo, useRef } from "react";
import Link from "next/link";
import { apiClient } from "src/utils/apiClient";
import { AsyncReturnType } from "src/utils/misc";

import getImage from "../utils/getImage";

interface IFormCard {
  post: AsyncReturnType<typeof apiClient.posts.postsIdGet>["post"];
  previewIcon?: string;
}
const FormCard = ({ post, previewIcon }: IFormCard) => {
  const iconImg = getImage({ icon: post?.icon, type: "icon", id: post?.id });
  const imgRef = useRef<HTMLImageElement>(null);

  const previewSrc = useMemo(() => {
    return previewIcon;
  }, [previewIcon]);

  return (
    <Link href={post?.published ? `/form/${post?.id}` : `/dashboard/${post?.id}`}>
      <a
        className="flex justify-start items-center pl-[9px] h-[88px] bg-black-lighter rounded-9 transition-transform hover:scale-[1.05] select-none ease-out-cubic fix-blurry-scale"
        title={post?.title || ""}
      >
        <div className="flex flex-row gap-5 items-center ">
          <img
            ref={imgRef}
            className="object-contain w-[70px] h-[70px] rounded-9"
            src={previewIcon ? previewSrc : iconImg}
            alt={post?.title || ""}
            onLoad={() => URL.revokeObjectURL(imgRef.current?.src!)}
          />
          <div className="flex flex-col">
            <h2 className="text-lg font-bold">{post?.title}</h2>
            <p className="text-xs font-medium text-grey">{post?.excerpt}</p>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default memo(FormCard);
