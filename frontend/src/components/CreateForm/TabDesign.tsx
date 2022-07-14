import { useState } from "react";
import { useTranslations } from "next-intl";
import { apiClient } from "src/utils/apiClient";
import { AsyncReturnType } from "src/utils/misc";

import FormCard from "../FormCard";
import { useFormData } from "../FormContext";
import FormEntry from "../FormEntry";
import ImageDropzone from "../ImageDropzone";

import {
  useBannerPreview,
  useCleanupContext as useCleanupContextOnUnmount,
  useIconPreview
} from "./TabDesign.hooks";

interface ITabDesign {
  post?: AsyncReturnType<typeof apiClient.posts.postsIdGet>["post"];
}

const TabDesign = ({ post }: ITabDesign) => {
  const initialTitle = post?.title;
  const initialDescription = post?.excerpt;
  const initialPostid = post?.id;
  const initialBanner = post?.banner;
  const initialIcon = post?.icon;

  const t = useTranslations();
  const { setValues } = useFormData();
  const [title, setTitle] = useState<string>(initialTitle || "");
  const [description, setDescription] = useState<string>(initialDescription || "");

  // delete data from context on unmount
  // MUST be BEFORE banner/icon preview
  useCleanupContextOnUnmount();

  const bannerPreview = useBannerPreview(initialPostid!, initialBanner!);
  const iconPreview = useIconPreview(initialPostid!, initialIcon!);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex relative flex-col gap-y-1 px-14 pt-5 pb-8 text-clip bg-black-lighter rounded-35">
        <div className="absolute top-0 left-0 w-full h-2 bg-pink" />
        {/* post title */}
        <input
          data-testid="title-input"
          className="relative p-2 text-2xl font-medium  bg-transparent border-b border-white/20  border-dotted transition-colors input--inline input--title"
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
          data-testid="description-input"
          className="relative p-2 text-xl font-medium  bg-transparent border-b border-white/20  border-dotted transition-colors input--inline"
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
      <div className="grid grid-cols-1 gap-x-24 gap-y-8 lg:grid-cols-6">
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

      <h2 className="text-lg text-center">Preview</h2>
      <FormEntry
        href="#"
        title={title}
        excerpt={description}
        user={{
          id: "0",
          avatar_url: "/images/avatar-guest.png",
          discord: "",
          username: "Username"
        }}
        previewBanner={bannerPreview}
      />
      <FormCard
        post={post}
        previewIcon={iconPreview}
        previewTitle={title}
        previewDescription={description}
      />
    </div>
  );
};

export default TabDesign;
