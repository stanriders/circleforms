import { Locales } from "../types/common-types";
import LOCALES from "../utils/i18n";

interface ILocale {
  flag?: string;
  locale?: Locales;
}

export default function Locale({ flag, locale = "en-US" }: ILocale) {
  return (
    <span className={`fi small fi-${LOCALES[locale] ? LOCALES[locale].flag : flag} rounded-5`} />
  );
}
