interface ImageProps {
  type: string;
  icon?: string | null;
  id?: string | null;
  banner?: string | null;
}

export default function getImage({ id, banner, icon, type = "banner" }: ImageProps) {
  if (type === "icon") {
    if (!icon || !id) {
      return `/images/form-entry-test-thumbnail.png`;
    }

    return `https://assets.circleforms.net/${id}/${icon}`;
  }

  if (type === "banner") {
    if (!banner || !id) {
      return `/images/form-entry-test.jpg`;
    }

    return `https://assets.circleforms.net/${id}/${banner}`;
  }
}
