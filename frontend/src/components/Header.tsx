import SVG from "react-inlinesvg";
import { Menu, MenuButton, MenuItem, MenuList } from "@reach/menu-button";
import VisuallyHidden from "@reach/visually-hidden";
import classNames from "classnames";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { navLinks } from "../constants";
import useAuth from "../hooks/useAuth";
import { Locales } from "../types/common-types";
import i18n from "../utils/i18n";

import Button from "./Button";
import Flag from "./Flag";
import SkipNavButton from "./SkipNavButton";

const languages = Object.values(i18n);

export default function Header() {
  const t = useTranslations("global");
  const router = useRouter();
  const { data: user } = useAuth();

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
    <header className="fixed top-0 z-navbar flex w-full items-center justify-between bg-black py-3 px-4 text-white md:px-16 lg:px-32">
      <SkipNavButton>
        <button type="button">Skip Navigation Links</button>
      </SkipNavButton>
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

      <div className="flex items-center gap-x-3">
        {(user && (
          <Menu>
            <MenuButton data-testid="profileButton">
              <div className="flex items-center gap-x-2 rounded-70 border-2 border-pink bg-black pl-4 font-bold">
                <span>{user?.osu?.username}</span>
                <img
                  className="m-1 h-9 w-9 rounded-70"
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
              <MenuItem
                data-testid="logoutButton"
                className="danger"
                onSelect={() => router.push("/api/OAuth/signout")}
              >
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
            <div className="flex items-center justify-center rounded-7 bg-black-lightest p-2">
              <Flag locale={router.locale as Locales} />
            </div>
          </MenuButton>
          <MenuList className="slide-down">
            {languages.map((language) => {
              return (
                <MenuItem
                  className="menu-language__item group"
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
