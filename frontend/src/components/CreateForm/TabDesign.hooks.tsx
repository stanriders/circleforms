import { useEffect, useMemo, useState } from "react";

import getImage from "../../utils/getImage";
import { useFormData } from "../FormContext";

export const useCleanupContext = () => {
  // delete data from context on unmount
  // must be before banner/icon preview set

  const { eraseValues } = useFormData();

  return useEffect(() => {
    return () => eraseValues();
  }, [eraseValues]);
};

export const useBannerPreview = (initialPostid?: string, initialBanner?: string) => {
  const { data, setValues } = useFormData();
  const [bannerPreview, setBannerPreview] = useState("");

  const bannerSrc = useMemo(() => {
    try {
      return URL.createObjectURL(data?.banner);
    } catch (e) {}
    return;
  }, [data?.banner]);

  // set banner preview from File field in context
  useEffect(() => {
    setBannerPreview(bannerSrc!);

    return () => {
      URL.revokeObjectURL(bannerSrc!);
    };
  }, [bannerSrc]);

  // in edit mode: set preview src from passed string
  useEffect(() => {
    // if there is a banner src already - exit
    if (bannerSrc) return;
    // otherwise fetch image from postid and set it
    const bannerImg = getImage({ id: initialPostid, type: "banner" });
    if (bannerImg) {
      setBannerPreview(bannerImg);
    }
  }, [bannerSrc, initialBanner, initialPostid, setValues]);

  return bannerPreview;
};

export const useIconPreview = (initialPostid?: string, initialIcon?: string) => {
  const { data, setValues } = useFormData();
  const [iconPreview, setIconPreview] = useState("");

  const iconSrc = useMemo(() => {
    try {
      return URL.createObjectURL(data?.icon);
    } catch (e) {}
    return;
  }, [data?.icon]);

  // set banner preview from File field in context
  useEffect(() => {
    setIconPreview(iconSrc!);
    return () => {
      URL.revokeObjectURL(iconSrc!);
    };
  }, [iconSrc]);

  // in edit mode: set preview src from passed string
  useEffect(() => {
    // if there is an icon src already - exit
    if (iconSrc) return;

    // otherwise fetch image from postid and set it
    const iconImg = getImage({ id: initialPostid, type: "icon" });
    if (iconImg) {
      setIconPreview(iconImg);
    }
  }, [iconSrc, initialIcon, initialPostid, setValues]);

  return iconPreview;
};
