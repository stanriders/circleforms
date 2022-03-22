import classNames from 'classnames'
import Link from 'next/link'

export default function Button({
  href,
  children,
  theme = 'primary',
  large,
  rounded,
  active,
}) {
  const classnames = classNames(
    'button',
    theme,
    large ? 'button--large' : '',
    rounded ? 'button--rounded' : '',
    active ? 'active' : '',
  )

  if (href) {
    return (
      <Link href={href} passHref>
        <a className={classnames}>
          {children}
        </a>
      </Link>
    )
  }

  return (
    <button
      className={classnames}>
      {children}
    </button>
  )
}