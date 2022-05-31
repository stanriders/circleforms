import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import getImage from "../../utils/getImage";
import FormCard from "../FormCard";
import { useFormData } from "../FormContext";
import FormEntry from "../FormEntry";
import ImageDropzone from "../ImageDropzone";

interface ITabDesign {
  initialTitle?: string;
  initialDescription?: string;
  initialPostid?: string;
  initialBanner?: string;
  initialIcon?: string;
}

const TabDesign = ({
  initialTitle,
  initialDescription,
  initialPostid,
  initialBanner,
  initialIcon
}: ITabDesign) => {
  const t = useTranslations();
  const { data, setValues } = useFormData();
  const [title, setTitle] = useState<string>(initialTitle || "");
  const [description, setDescription] = useState<string>(initialDescription || "");

  const [bannerPreview, setBannerPreview] = useState("");
  const [iconPreview, setIconPreview] = useState("");

  useEffect(() => {
    try {
      const src = URL.createObjectURL(data?.banner);
      setBannerPreview(src);
    } catch (e) {}
  }, [data?.banner]);

  useEffect(() => {
    try {
      const src = URL.createObjectURL(data?.icon);
      setIconPreview(src);
    } catch (e) {}
  }, [data?.icon]);

  useEffect(() => {
    const bannerImg = getImage({ id: initialPostid, banner: initialBanner, type: "banner" });
    const iconImg = getImage({ id: initialPostid, icon: initialIcon, type: "icon" });
    if (bannerImg) {
      setBannerPreview(bannerImg);
    }
    if (iconImg) {
      setIconPreview(iconImg);
    }
  }, [initialBanner, initialIcon, initialPostid]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-y-1 rounded-35 bg-black-lighter pt-5 pb-8 px-14 relative overflow-clip">
        <div className="absolute left-0 top-0 bg-pink h-2 w-full" />
        {/* post title */}
        <input
          className="input--inline bg-transparent text-2xl font-medium  border-b border-dotted border-white border-opacity-20 p-2 relative transition-colors input--title"
          type="text"
          placeholder={t("placeholders.title")}
          value={title}
          required={true}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => {
            setValues({ title: title });
          }}
        />
        {/* post description */}
        <input
          className="input--inline bg-transparent text-xl font-medium  border-b border-dotted border-white border-opacity-20 p-2 relative transition-colors"
          type="text"
          placeholder={t("placeholders.excerpt")}
          required={true}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => {
            setValues({ excerpt: description });
          }}
        />
      </div>

      {/* image select */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-y-8 gap-x-24">
        <div className="lg:col-span-2">
          <ImageDropzone
            classname="aspect-square"
            headingText="Icon"
            name="icon"
            fileAcceptCallback={setValues}
            defaultPreview={iconPreview}
          />
        </div>
        <div className="lg:col-span-4">
          <ImageDropzone
            headingText="Banner"
            name="banner"
            fileAcceptCallback={setValues}
            defaultPreview={bannerPreview}
          />
        </div>
      </div>

      <FormEntry
        title={title}
        excerpt={description}
        user={{
          id: "0",
          avatarUrl: "/images/avatar-guest.png",
          discord: "",
          username: "Username"
        }}
        isPreview={true}
        previewBanner={bannerPreview}
      />
      <FormCard
        id={initialPostid}
        title={title}
        excerpt={description}
        isPreview={true}
        previewIcon={iconPreview}
      />
    </div>
  );
};

export default TabDesign;
