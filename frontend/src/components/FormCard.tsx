import { memo, useMemo, useRef } from "react";
import { GrTrash } from "react-icons/gr";
import VisuallyHidden from "@reach/visually-hidden";
import Link from "next/link";
import { apiClient } from "src/utils/apiClient";
import { AsyncReturnType } from "src/utils/misc";

import getImage from "../utils/getImage";

interface IFormCard {
  post: AsyncReturnType<typeof apiClient.posts.postsIdGet>["post"];
  previewTitle?: string;
  previewDescription?: string;
  previewIcon?: string;
  onDelete?: () => void;
}
const FormCard = ({ post, previewIcon, onDelete, previewDescription, previewTitle }: IFormCard) => {
  const iconImg = getImage({ icon: post?.icon, type: "icon", id: post?.id });
  const imgRef = useRef<HTMLImageElement>(null);

  console.log(post);

  const previewSrc = useMemo(() => {
    return previewIcon;
  }, [previewIcon]);

  return (
    <Link href={post?.published ? `/form/${post?.id}` : `/dashboard/${post?.id}`}>
      <a
        className="group flex overflow-hidden justify-start items-center pl-[9px] h-[88px] bg-black-lighter rounded-9 transition-transform duration-150 hover:scale-[1.05] select-none ease-out-cubic fix-blurry-scale"
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
            <h2 className="text-lg font-bold">{previewTitle ? previewTitle : post?.title}</h2>
            <p className="text-xs font-medium text-grey">
              {previewDescription ? previewDescription : post?.excerpt}
            </p>
          </div>
        </div>
        <button
          className="ml-auto h-full bg-red-400 duration-150 ease-out translate-x-full group-hover:translate-x-0 group-focus:translate-x-0"
          onClick={(e) => {
            e.preventDefault();
            onDelete && onDelete();
          }}
        >
          <GrTrash className="mx-3 w-8 h-8" />
          <VisuallyHidden>Delete form</VisuallyHidden>
        </button>
      </a>
    </Link>
  );
};

export default memo(FormCard);
