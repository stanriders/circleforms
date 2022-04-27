import LOCALES from "../libs/i18n";

interface ILocaleTypes {
  flag: string;
  locale: keyof typeof LOCALES;
}
export default function Locale({ flag, locale }: ILocaleTypes) {
  return (
    <span className={`fi small fi-${LOCALES[locale] ? LOCALES[locale].flag : flag} rounded-5`} />
  );
}
