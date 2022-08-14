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

  const previewSrc = useMemo(() => {
    return previewIcon;
  }, [previewIcon]);

  return (
    <Link href={post?.published ? `/form/${post?.id}` : `/dashboard/${post?.id}`}>
      <a
        className="fix-blurry-scale group flex h-[88px] select-none items-center justify-start overflow-hidden rounded-9 bg-black-lighter pl-[9px] transition-transform duration-150 ease-out-cubic hover:scale-[1.05]"
        title={post?.title || ""}
      >
        <div className="flex flex-row items-center gap-5 ">
          <img
            ref={imgRef}
            className="h-[70px] w-[70px] rounded-9 object-contain"
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
          className="ml-auto h-full translate-x-full bg-red-400 duration-150 ease-out group-hover:translate-x-0 group-focus:translate-x-0"
          onClick={(e) => {
            e.preventDefault();
            onDelete && onDelete();
          }}
        >
          <GrTrash className="mx-3 h-8 w-8" />
          <VisuallyHidden>Delete form</VisuallyHidden>
        </button>
      </a>
    </Link>
  );
};

export default memo(FormCard);
