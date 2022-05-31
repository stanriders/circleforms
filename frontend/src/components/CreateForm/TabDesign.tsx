import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { useFormData } from "../FormContext";
import FormEntry from "../FormEntry";
import ImageDropzone from "../ImageDropzone";

const TabDesign = () => {
  const t = useTranslations();
  const { data, setValues } = useFormData();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const previewUrl = useMemo(() => {
    try {
      return URL.createObjectURL(data?.banner);
    } catch (e) {}
  }, [data?.banner]);

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
          />
        </div>
        <div className="lg:col-span-4">
          <ImageDropzone headingText="Banner" name="banner" fileAcceptCallback={setValues} />
        </div>
      </div>

      <FormEntry
        user={{
          id: "0",
          avatarUrl: "/images/avatar-guest.png",
          discord: "",
          username: "Username"
        }}
        isPreview={true}
        title={title}
        excerpt={description}
        previewBanner={previewUrl}
      />
    </div>
  );
};

export default TabDesign;
