interface ImageProps {
  type: "banner" | "icon";
  icon?: string | null;
  id?: string | null;
  banner?: string | null;
}

export default function getImage({ id, type = "banner" }: ImageProps) {
  if (!id) return;
  const isDev = process.env.NODE_ENV === "development";

  if (type === "icon") {
    return isDev ? `/images/icon-placeholder.png` : `https://assets.circleforms.net/${id}/icon.jpg`;
  }

  if (type === "banner") {
    return isDev
      ? `/images/banner-placeholder.png`
      : `https://assets.circleforms.net/${id}/banner.jpg`;
  }
}
