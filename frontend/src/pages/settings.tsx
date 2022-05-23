import Head from "next/head";

import DefaultLayout from "../layouts";

import { useContext, useEffect } from "react";
import SVG from "react-inlinesvg";

import useAuth from "../hooks/useAuth";

import { useTranslations } from "next-intl";
import UserContext from "../context/UserContext";
import Unauthorized from "../components/Unauthorized";
import Title from "../components/Title";
import Button from "../components/Button";
import { Locales } from "../types/common-types";

export default function Settings() {
  const t = useTranslations();
  const { user } = useContext(UserContext);
  const { invalidateUserCache } = useAuth();

  useEffect(() => {
    invalidateUserCache();

    //TODO fixme
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user) {
    return <Unauthorized />;
  }

  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - {t("title")}</title>
      </Head>

      <Title title={t("subtitle")}>
        <p className="text-2xl mt-2">{t("description")}</p>
      </Title>

      <section className="container bg-black-dark2 rounded-70 px-10 py-8">
        <div className="space-y-8">
          {/* osu! integration */}
          <div className="flex justify-between bg-black-lightest rounded-40 px-6 py-4">
            <div className="flex items-center">
              <img
                className="h-28 w-28 rounded-full"
                // TODO fixme, should be avatarUrl but it breaks for some reason
                // @ts-ignore
                src={user.osu?.avatar_url}
                alt={user.osu?.username}
              />
              <div className="pl-3">
                <h2 className="font-bold text-3xl">osu!</h2>
                <p className="text-sm">{t("integrations.osu.description")}</p>
              </div>
            </div>
            <div className="flex flex-col justify-center text-right text-lg text-white text-opacity-50">
              <p>
                {t("integrations.osu.connectedTo")} {user.id} ({user.osu?.username})
              </p>
              {/* <p>
                { t('integrations.osu.withForms', {
                  count: user.posts.length
                }) }
              </p> */}
            </div>
          </div>

          {/* Discord integration */}
          <div className="flex justify-between bg-black-lightest rounded-40 px-6 py-4">
            <div className="flex items-center">
              <div className="w-28 h-28 flex items-center justify-center">
                <SVG className="w-full p-4" src="/svg/discord.svg" />
              </div>
              <div className="pl-3">
                <h2 className="font-bold text-3xl">Discord</h2>
                <p className="text-sm">{t("integrations.discord.description")}</p>
              </div>
            </div>
            <div className="flex flex-col justify-center text-right text-lg text-white text-opacity-50">
              <Button
                // @ts-ignore
                disabled
                style={{
                  outlineColor: "#5865F2",
                  color: "#5865F2"
                }}
              >
                {t("connect")}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}

export async function getStaticProps({ locale }: { locale: Locales }) {
  const [translations, global] = await Promise.all([
    import(`../messages/settings/${locale}.json`),
    import(`../messages/global/${locale}.json`)
  ]);

  const messages = {
    ...translations,
    ...global
  };

  return {
    props: {
      messages
    }
  };
}
