import LOCALES from "../libs/i18n"

export default function Locale({ flag, locale }) {
  return (
    <span className={`fi small fi-${LOCALES[locale] ? LOCALES[locale].flag : flag} rounded-5`} />
  )
}
