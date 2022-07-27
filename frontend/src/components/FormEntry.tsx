import Link from "next/link";
import * as timeago from "timeago.js";

import { MinimalPostContract, UserMinimalContract } from "../../openapi";
import getImage from "../utils/getImage";

interface IFormEntry extends MinimalPostContract {
  user: UserMinimalContract | undefined;
  previewBanner?: string;
  href: string;
}

export default function FormEntry({
  id,
  user,
  banner,
  title,
  excerpt,
  publish_time,
  previewBanner,
  href
}: IFormEntry) {
  const bannerImg = getImage({ banner, id, type: "banner" });

  const getImagePreview = () => {
    if (previewBanner) {
      return previewBanner;
    }
    if (bannerImg) {
      return bannerImg;
    }
  };

  const img = getImagePreview();

  return (
    <Link href={href}>
      <a className="z-0 flex text-clip rounded-5 bg-black-light transition-transform ease-out-cubic hover:z-10 hover:scale-99">
        <div
          className="flex-1 bg-cover"
          style={{
            backgroundImage: `
              linear-gradient(270deg, #131313 7.39%, rgba(17, 17, 17, 0) 98.16%),
             ${img ? `url(${img})` : undefined}
            
            `,
            backgroundPosition: "center"
          }}
        />
        <div className="flex flex-1 justify-between py-5 pr-5">
          <div>
            <h3 className="text-m max-w-sm truncate font-bold">{title}</h3>
            <p className="-mt-1 max-w-sm truncate text-xs text-white text-opacity-50">{excerpt}</p>
          </div>
          <div className="flex items-center">
            <div className="mr-2 flex flex-col text-right text-xs">
              <span className="font-semibold">
                posted by <span className="font-bold">{user?.username}</span>
              </span>
              <span className="text-green">{timeago.format(publish_time!)}</span>
            </div>
            <img
              className="h-10 w-10 rounded-full"
              src={user?.avatar_url || ""}
              alt="Profile user {name}"
            />
          </div>
        </div>
      </a>
    </Link>
  );
}
