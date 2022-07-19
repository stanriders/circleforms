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
      <a className="flex z-0 hover:z-10 text-clip bg-black-light rounded-5 transition-transform hover:scale-99 ease-out-cubic">
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
            <h3 className="max-w-sm font-bold truncate text-m">{title}</h3>
            <p className="-mt-1 max-w-sm text-xs text-white truncate text-opacity-50">{excerpt}</p>
          </div>
          <div className="flex items-center">
            <div className="flex flex-col mr-2 text-xs text-right">
              <span className="font-semibold">
                posted by <span className="font-bold">{user?.username}</span>
              </span>
              <span className="text-green">{timeago.format(publish_time!)}</span>
            </div>
            <img
              className="w-10 h-10 rounded-full"
              src={user?.avatar_url || ""}
              alt="Profile user {name}"
            />
          </div>
        </div>
      </a>
    </Link>
  );
}
