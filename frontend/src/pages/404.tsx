import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import Button from "../components/Button";
import Hero from "../components/Hero";
import DefaultLayout from "../layouts";
import { Locales } from "../types/common-types";

export default function Error404() {
  const t = useTranslations();
  const router = useRouter();

  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - 404</title>
      </Head>

      <Hero>
        <div className="flex flex-col items-center justify-center py-16 md:py-32 lg:pt-52 lg:pb-72">
          <h3 className="text-center text-4xl lg:-mt-10">{t("subtitle")}</h3>
          <code className="mt-2 bg-black-lightest p-2">{router.asPath}</code>
          <div className="mt-14 flex flex-col gap-8 pb-2 lg:flex-row lg:pb-0">
            <Button theme="secondary" large href="/">
              {t("goBack")}
            </Button>
          </div>
        </div>
      </Hero>
    </DefaultLayout>
  );
}

export async function getStaticProps({ locale }: { locale: Locales }) {
  const [translations, global] = await Promise.all([
    import(`../messages/404/${locale}.json`),
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
