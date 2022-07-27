import SVG from "react-inlinesvg";
import Head from "next/head";
import { useTranslations } from "next-intl";
import Unauthorized from "src/components/Unauthorized";
import useAuth from "src/hooks/useAuth";

import Button from "../components/Button";
import Title from "../components/Title";
import DefaultLayout from "../layouts";
import { Locales } from "../types/common-types";

const Settings = () => {
  const t = useTranslations();
  const { data: user } = useAuth();

  if (!user) {
    return <Unauthorized />;
  }

  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - {t("title")}</title>
      </Head>

      <Title title={t("subtitle")} description={t("description")} />

      <section className="container rounded-70 bg-black-dark2 py-8 px-10">
        <div className="space-y-8">
          {/* osu! integration */}
          <div className="flex justify-between rounded-40 bg-black-lightest py-4 px-6">
            <div className="flex items-center">
              <img
                className="h-28 w-28 rounded-full"
                src={user?.osu?.avatar_url!}
                alt={user?.osu?.username!}
              />
              <div className="pl-3">
                <h2 className="text-3xl font-bold">osu!</h2>
                <p className="text-sm">{t("integrations.osu.description")}</p>
              </div>
            </div>
            <div className="flex flex-col justify-center text-right text-lg text-white text-opacity-50">
              <p>
                {t("integrations.osu.connectedTo")} {user?.id} ({user?.osu?.username})
              </p>
            </div>
          </div>

          {/* Discord integration */}
          <div className="flex justify-between rounded-40 bg-black-lightest py-4 px-6">
            <div className="flex items-center">
              <div className="flex h-28 w-28 items-center justify-center">
                <SVG className="w-full p-4" src="/svg/discord.svg" />
              </div>
              <div className="pl-3">
                <h2 className="text-3xl font-bold">Discord</h2>
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
};

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

export default Settings;
