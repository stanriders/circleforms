import Link from "next/link";
import * as timeago from "timeago.js";
import { MinimalPostContract, UserMinimalContract } from "../../openapi";

import getImage from "../utils/getImage";

interface IFormEntry extends MinimalPostContract {
  user: UserMinimalContract | undefined;
  isPreview?: boolean;
  previewBanner?: string;
}

export default function FormEntry({
  id,
  user,
  banner,
  title,
  excerpt,
  publishTime,
  previewBanner,
  isPreview
}: IFormEntry) {
  const bannerImg = getImage({ banner, id, type: "banner" });

  return (
    <Link href={isPreview ? "" : `/form/${id}`}>
      <a className="flex rounded-5 overflow-clip bg-black-light z-0 transform transition-transform ease-out-cubic hover:scale-99 hover:z-10">
        <div
          className="flex-1 bg-cover"
          style={{
            backgroundImage: `
              linear-gradient(270deg, #131313 2.39%, rgba(17, 17, 17, 0) 98.16%),
              url('${previewBanner ? previewBanner : bannerImg}')
            `,
            backgroundPosition: "center"
          }}
        />
        <div className="flex-1 flex justify-between py-5 pr-5">
          <div>
            <h3 className="text-m font-bold truncate max-w-sm">{title}</h3>
            <p className="text-xs text-white text-opacity-50 -mt-1 truncate max-w-sm">{excerpt}</p>
          </div>
          <div className="flex items-center">
            <div className="flex flex-col text-xs mr-2 text-right">
              <span className="font-semibold">
                posted by <span className="font-bold">{user?.username}</span>
              </span>
              {/* FIXME im not sure about this, maybe publish time needs to be converted to datetime first? */}
              <span className="text-green">{timeago.format(publishTime!)}</span>
            </div>
            <img
              className="h-10 w-10 rounded-full"
              src={user?.avatarUrl || ""}
              alt="Profile user {name}"
            />
          </div>
        </div>
      </a>
    </Link>
  );
}
