import LOCALES from "../libs/i18n";
import { Locales } from "../types/common-types";

interface ILocale {
  flag?: string;
  locale?: Locales;
}

export default function Locale({ flag, locale = "en-US" }: ILocale) {
  return (
    <span className={`fi small fi-${LOCALES[locale] ? LOCALES[locale].flag : flag} rounded-5`} />
  );
}
