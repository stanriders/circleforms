import { useContext } from "react";
import SVG from "react-inlinesvg";
import { Menu, MenuButton, MenuItem, MenuList } from "@reach/menu-button";
import VisuallyHidden from "@reach/visually-hidden";
import classNames from "classnames";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { navLinks } from "../constants";
import UserContext from "../context/UserContext";
import useAuth from "../hooks/useAuth";
import { Locales } from "../types/common-types";
import i18n from "../utils/i18n";

import Button from "./Button";
import Flag from "./Flag";

const languages = Object.values(i18n);

export default function Header() {
  const t = useTranslations("global");
  const router = useRouter();
  const { user } = useContext(UserContext);
  const { logout } = useAuth();

  function changeLocale(locale: Locales) {
    router.push(
      {
        pathname: router.pathname,
        query: router.query
      },
      router.asPath,
      { locale }
    );

    // Override the accept language header to persist chosen language
    // @see https://nextjs.org/docs/advanced-features/i18n-routing#leveraging-the-next_locale-cookie
    Cookies.set("NEXT_LOCALE", locale);
  }

  return (
    <header className="flex fixed top-0 z-navbar justify-between items-center py-3 px-4 w-full text-white bg-black md:px-16 lg:px-32">
      <div className="flex items-center">
        <Link href="/" passHref>
          <a>
            <VisuallyHidden>Circle Forms</VisuallyHidden>
            <SVG className="mr-16 h-12" src="/svg/logo.svg" />
          </a>
        </Link>

        <ul className="hidden gap-x-1 md:flex">
          {navLinks.map(({ id, href }) => (
            <li key={id}>
              <Link href={href} passHref>
                <a className={classNames("link", href === router.pathname ? "active" : "")}>
                  {t(`navbar.${id}`)}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-x-3 items-center">
        {(user && (
          <Menu>
            <MenuButton data-testid="profileButton">
              <div className="flex gap-x-2 items-center pl-4 font-bold bg-black rounded-70 border-2 border-pink">
                <span>{user?.osu?.username}</span>
                <img
                  className="m-1 w-9 h-9 rounded-70"
                  src={user?.osu?.avatar_url || ""}
                  alt={user?.osu?.username!}
                />
              </div>
            </MenuButton>
            <MenuList className="slide-down">
              <MenuItem data-testid="manageAnswers" onSelect={() => router.push("/answers")}>
                Answers
              </MenuItem>
              <MenuItem data-testid="manageForms" onSelect={() => router.push("/dashboard")}>
                {t("navbar.dashboard")}
              </MenuItem>
              <MenuItem data-testid="settingsButton" onSelect={() => router.push("/settings")}>
                {t("navbar.settings")}
              </MenuItem>
              <MenuItem data-testid="logoutButton" className="danger" onSelect={logout}>
                {t("navbar.logout")}
              </MenuItem>
            </MenuList>
          </Menu>
        )) || (
          <Button onClick={() => {}} href="/api/OAuth/auth">
            {t("navbar.login")}
          </Button>
        )}

        <Menu>
          <MenuButton>
            <div className="flex justify-center items-center p-2 bg-black-lightest rounded-7">
              <Flag locale={router.locale as Locales} />
            </div>
          </MenuButton>
          <MenuList className="slide-down">
            {languages.map((language) => {
              return (
                <MenuItem
                  className="group menu-language__item"
                  key={language.locale}
                  onSelect={() => changeLocale(language.locale as Locales)}
                >
                  <div
                    className={classNames(
                      "pill",
                      language.locale === router.locale ? "active" : ""
                    )}
                  />
                  <Flag locale={language.locale as Locales} />
                  <span className="ml-3">{language.name}</span>
                </MenuItem>
              );
            })}
          </MenuList>
        </Menu>
      </div>
    </header>
  );
}
