import SVG from 'react-inlinesvg'
import Link from "next/link";
import { useRouter } from 'next/router'
import Button from './atoms/Button';
import { navLinks } from '../constants';
import classNames from 'classnames';

export default function Header() {
  const router = useRouter()

  return (
    <header className="flex items-center justify-between bg-black text-white py-6 4 w-full md:px-16 lg:px-32">
      <div className="flex items-center">
        <Link href="/" passHref>
          <a>
            <SVG className="h-12 mr-16" src="/svg/logo.svg" alt="CircleForms" />
          </a>
        </Link>

        <ul className="hidden md:flex gap-x-1">
          {navLinks.map(({ label, href }) => (
            <li key={label}>
              <Link href={href} passHref>
                <a className={classNames("link", href === router.pathname ? 'active': '' )}>
                  {label}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <Button>
          login
        </Button>
      </div>
    </header>
  )
}