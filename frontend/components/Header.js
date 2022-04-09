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
import Flag from './atoms/Flag';
import Cookies from 'js-cookie';
import i18n from '../libs/i18n'
import { useTranslations } from 'next-intl';

const languages = Object.values(i18n);

export default function Header() {
  const t = useTranslations('global')
  const router = useRouter()
  const { user } = useContext(UserContext)
  const { logout } = useAuth()

  function changeLocale(locale) {
    router.push({
      pathname: router.pathname,
      query: router.query,
    }, router.asPath, { locale })

    // Override the accept language header to persist chosen language
    // @see https://nextjs.org/docs/advanced-features/i18n-routing#leveraging-the-next_locale-cookie
    Cookies.set('NEXT_LOCALE', locale)
  }

  return (
    <header className="fixed top-0 flex items-center justify-between bg-black text-white px-4 py-3 4 w-full z-navbar md:px-16 lg:px-32">
      <div className="flex items-center">
        <Link href="/" passHref>
          <a>
            <SVG className="h-12 mr-16" src="/svg/logo.svg" alt="CircleForms" />
          </a>
        </Link>

        <ul className="hidden md:flex gap-x-1">
          {navLinks.map(({ id, href }) => (
            <li key={id}>
              <Link href={href} passHref>
                <a className={classNames("link", href === router.pathname ? 'active': '' )}>
                  { t(`navbar.${id}`) }
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
                { t('navbar.dashboard') }
              </MenuItem>
              <MenuItem onSelect={() => router.push('/settings')}>
                { t('navbar.settings') }
              </MenuItem>
              <MenuItem className="danger" onSelect={logout}>
                { t('navbar.logout') }
              </MenuItem>
            </MenuList>
          </Menu>
        ) || (
          <Button href="/api/OAuth/auth">
            { t('navbar.login') }
          </Button>
        )}

          <Menu>
            <MenuButton>
              <div className="flex items-center justify-center rounded-7 bg-black-lightest px-2 py-1">
                <Flag locale={router.locale} />
              </div>
            </MenuButton>
            <MenuList className="slide-down">
              {languages.map(language => (
                <MenuItem
                  className="menu-language__item group"
                  key={language.locale}
                  onSelect={() => changeLocale(language.locale)}>
                  <div className={classNames(
                    "pill",
                    language.locale === router.locale ? 'active': ''
                  )} />
                  <Flag flag={language.flag} />
                  <span className="ml-3">{language.name}</span>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
      </div>
    </header>
  )
}