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
  MenuItem,
} from "@reach/menu-button";
import useAuth from '../hooks/useAuth';

export default function Header() {
  const router = useRouter()
  const { user } = useContext(UserContext)
  const { logout } = useAuth()

  return (
    <header className="fixed top-0 flex items-center justify-between bg-black text-white px-4 py-3 4 w-full z-navbar md:px-16 lg:px-32">
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
          <Menu>
            <MenuButton>
              <div className="flex items-center gap-x-2 pl-4 bg-black border-2 border-pink rounded-70 font-bold">
                <span>{user.username}</span>
                <img
                  className="h-9 w-9 rounded-70 m-1"
                  src={user.avatar_url}
                  alt={user.username} />
              </div>
            </MenuButton>
            <MenuList className="slide-down">
              <MenuItem onSelect={() => router.push('/dashboard')}>
                Dashboard
              </MenuItem>
              <MenuItem onSelect={() => router.push('/settings')}>
                Settings
              </MenuItem>
              <MenuItem className="danger" onSelect={logout}>
                Log Out
              </MenuItem>
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