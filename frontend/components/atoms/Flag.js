import i18n from '../../libs/i18n'

export default function Locale({ flag, locale }) {
  return (
    <span className={`fi small fi-${i18n[locale] ? i18n[locale].flag : flag} rounded-5`} />
  )
}