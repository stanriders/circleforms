import SVG from 'react-inlinesvg'
import Link from "next/link";
import { useRouter } from 'next/router'
import Button from './atoms/Button';
import { navLinks } from '../constants';
import classNames from 'classnames';
import { useContext, useEffect } from 'react';
import UserContext from './context/UserContext';
import {
  Menu,
  MenuList,
  MenuButton,
} from "@reach/menu-button";

export default function Header() {
  const router = useRouter()
  const { user, setUser } = useContext(UserContext)

  return (
    <header className="flex items-center justify-between bg-black text-white py-3 4 w-full md:px-16 lg:px-32">
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

      <div className="flex items-center gap-x-3">
        {user && (
          <Menu className="slide-down">
            <MenuButton>
              <div className="flex items-center gap-x-2 pl-4 bg-black font-display text-lg border-2 border-pink rounded-70">
                <span>{user.username}</span>
                <img
                  className="h-9 w-9 rounded-70 m-1"
                  src={user.avatar_url}
                  alt={user.username} />
              </div>
            </MenuButton>
            <MenuList>
              <Link href="/dashboard" passHref>
                <a>
                  Dashboard
                </a>
              </Link>
              <Link href="/settings" passHref>
                <a>
                  Settings
                </a>
              </Link>
              <Link href="/api/OAuth/signout" passHref>
                <a className="danger">
                  Log Out
                </a>
              </Link>
            </MenuList>
          </Menu>
        ) || (
          <Button href="/api/OAuth/auth">
            login
          </Button>
        )}
      </div>
    </header>
  )
}