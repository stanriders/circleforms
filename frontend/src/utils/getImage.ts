interface ImageProps {
  type: "banner" | "icon";
  icon?: string | null;
  id?: string | null;
  banner?: string | null;
}

export default function getImage({ id, banner, icon, type }: ImageProps) {
  if (!id) return;
  if (type === "banner" && !banner) return `/images/banner-placeholder.png`;
  if (type === "icon" && !icon) return `/images/icon-placeholder.png`;

  const isDev = process.env.NODE_ENV === "development";

  if (type === "icon") {
    return isDev ? `/images/icon-placeholder.png` : `https://assets.circleforms.net/${id}/${icon}`;
    // return `https://assets.circleforms.net/${id}/${icon}`;
  }

  if (type === "banner") {
    return isDev
      ? `/images/banner-placeholder.png`
      : `https://assets.circleforms.net/${id}/${banner}`;
    // return `https://assets.circleforms.net/${id}/${banner}`;
  }
}
