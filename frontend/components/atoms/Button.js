import classNames from 'classnames'
import Link from 'next/link'

export default function Button({ href, children, theme = 'primary', large }) {
  if (href) {
    return (
      <Link href={href} passHref>
        <a className={classNames('button', theme, large ? 'button--large' : '')}>
          {children}
        </a>
      </Link>
    )
  }

  return (
    <button
      className={classNames('button', theme, large ? 'button--large' : '')}>
      {children}
    </button>
  )
}